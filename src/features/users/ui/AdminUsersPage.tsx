import { useEffect, useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { CreateUserUsecase } from '../application/create-user.usecase';
import { GetUsersUsecase } from '../application/get-users.usecase';
import { usersRepository } from '../infrastructure/users.api';
import { CreateUserForm } from './CreateUserForm';
import { UserTable } from './components/UserTable';
import type { User } from '../domain/user.entity';
import { PginaLogTable } from '../../pginalog/ui/PginaLogTable';

const createUserUsecase = new CreateUserUsecase(usersRepository);
const getUsersUsecase = new GetUsersUsecase(usersRepository);

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchUsers = async () => {
    setError(null);
    setLoadingList(true);
    try {
      const data = await getUsersUsecase.execute();
      setUsers(data);
    } catch (err: any) {
      setError(err?.message || 'No se pudo cargar usuarios');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFile = async (file: File) => {
    setImportResult(null);
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: 'array' });
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];

    // Try parse as objects (using headers)
    const objRows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    type ImportRow = {
      userName?: string;
      password?: string;
      email?: string;
      name?: string;
      apellidoPaterno?: string;
      apellidoMaterno?: string;
    };

    let items: ImportRow[] = [];

    if (objRows.length > 0 && typeof objRows[0] === 'object' && !Array.isArray(objRows[0])) {
      const headerKeys = Object.keys(objRows[0]);
      const normalize = (s: string) => s.toLowerCase().replace(/\s|_/g, '');
      const userKey = headerKeys.find((k) => ['username', 'user', 'username', 'usuario', 'userName'.toLowerCase()].includes(normalize(k)));
      const emailKey = headerKeys.find((k) => ['email', 'correo', 'correo electrónico', 'correoelectronico'].includes(normalize(k)));
      const passKey = headerKeys.find((k) => ['password', 'pass', 'contraseña', 'clave'].includes(normalize(k)));
      const nameKey = headerKeys.find((k) => ['nombre', 'name'].includes(normalize(k)));
      const apPatKey = headerKeys.find((k) => ['apellidopaterno', 'apellido paterno', 'apellido_paterno'].includes(normalize(k)));
      const apMatKey = headerKeys.find((k) => ['apellidomaterno', 'apellido materno', 'apellido_materno'].includes(normalize(k)));

      if (userKey && emailKey && passKey) {
        items = objRows
          .map((r) => ({
            userName: String(r[userKey] ?? '').trim(),
            email: String(r[emailKey] ?? '').trim(),
            password: String(r[passKey] ?? '').trim(),
            name: nameKey ? String(r[nameKey] ?? '').trim() : '',
            apellidoPaterno: apPatKey ? String(r[apPatKey] ?? '').trim() : '',
            apellidoMaterno: apMatKey ? String(r[apMatKey] ?? '').trim() : '',
          }))
          .filter((r) => r.userName && r.password && r.name && r.apellidoPaterno && r.apellidoMaterno);
      } else {
        // Fallback: try common header names
        const guessedUserKey = headerKeys.find((k) => normalize(k).includes('user'));
        const guessedPassKey = headerKeys.find((k) => normalize(k).includes('pass') || normalize(k).includes('clave') || normalize(k).includes('contraseña'));
        if (guessedUserKey && guessedPassKey) {
          items = objRows
            .map((r) => ({
              userName: String(r[guessedUserKey] ?? '').trim(),
              password: String(r[guessedPassKey] ?? '').trim(),
              email: emailKey ? String(r[emailKey] ?? '').trim() : '',
              name: nameKey ? String(r[nameKey] ?? '').trim() : '',
              apellidoPaterno: apPatKey ? String(r[apPatKey] ?? '').trim() : '',
              apellidoMaterno: apMatKey ? String(r[apMatKey] ?? '').trim() : '',
            }))
            .filter((r) => r.userName && r.password && r.name && r.apellidoPaterno && r.apellidoMaterno);
        }
      }
    }

    // If still empty, parse as arrays and take first columns
    if (items.length === 0) {
      const arrRows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      // If first row looks like headers, skip it when it contains non-empty strings
      let startIndex = 0;
      if (arrRows.length > 0 && Array.isArray(arrRows[0]) && arrRows[0].some((c: any) => typeof c === 'string' && c.trim().length > 0)) {
        startIndex = 1;
      }
      for (let i = startIndex; i < arrRows.length; i++) {
        const row = arrRows[i] as any[];
        if (!row) continue;
        const userName = row[0] ?? '';
        const password = row[1] ?? '';
        const email = row[2] ?? '';
        const name = row[3] ?? '';
        const apellidoPaterno = row[4] ?? '';
        const apellidoMaterno = row[5] ?? '';
        const record = {
          userName: String(userName).trim(),
          password: String(password).trim(),
          email: String(email).trim(),
          name: String(name).trim(),
          apellidoPaterno: String(apellidoPaterno).trim(),
          apellidoMaterno: String(apellidoMaterno).trim(),
        };
        if (record.userName && record.password && record.name && record.apellidoPaterno && record.apellidoMaterno) {
          items.push(record);
        }
      }
    }

    if (items.length === 0) {
      throw new Error('No se encontraron filas válidas en el archivo');
    }

    const successes: string[] = [];
    const failures: string[] = [];

    for (const it of items) {
      if (!it.userName || !it.password) {
        failures.push(`Fila inválida: ${JSON.stringify(it)}`);
        continue;
      }
      try {
        await createUserUsecase.execute({
          userName: it.userName,
          password: it.password,
          email: it.email,
          name: it.name ?? '',
          apellidoPaterno: it.apellidoPaterno ?? '',
          apellidoMaterno: it.apellidoMaterno ?? '',
        });
        successes.push(it.userName);
      } catch (err: any) {
        failures.push(`${it.userName}: ${err?.message || 'error'}`);
      }
    }

    await fetchUsers();

    const summary = `Importación finalizada. Éxitos: ${successes.length}. Fallos: ${failures.length}.` + (failures.length ? ` Errores: ${failures.slice(0, 5).join('; ')}` : '');
    setImportResult(summary);
  };

  return (
    <div className="flex flex-col gap-8  ">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-slate-900">Administracion de usuarios</h1>
          <p className="text-sm text-slate-600">Solo admins pueden crear y ver usuarios.</p>
        </div>
        <div className=' flex items-center justify-center gap-2'>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center rounded-[4px] bg-[#006AE2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#015ac1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
          >
            Agregar usuario
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center rounded-lg border border-[#D4D4D4] bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
          >
            Importar usuarios
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={async (e: ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setImportResult(null);
            setLoadingImport(true);
            try {
              await handleFile(f);
            } catch (err: any) {
              setImportResult(err?.message || 'Error al importar');
            } finally {
              setLoadingImport(false);
              e.currentTarget.value = '';
            }
          }}
          className="hidden"
        />
        {loadingImport ? (
          <p className="text-sm text-slate-600">Importando...</p>
        ) : importResult ? (
          <p className="text-sm text-slate-600">{importResult}</p>
        ) : null}
      </div>

      <UserTable 
        users={users}
        loading={loadingList}
        error={error}
        onRefresh={fetchUsers}
      />

      <PginaLogTable />

      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute right-3 top-3 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
            <CreateUserForm
              loading={loadingCreate}
              onSubmit={async (values) => {
                setLoadingCreate(true);
                setError(null);
                try {
                  await createUserUsecase.execute(values);
                  await fetchUsers();
                  setShowCreateModal(false);
                } catch (err: any) {
                  setError(err?.message || 'No se pudo crear el usuario');
                } finally {
                  setLoadingCreate(false);
                }
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
