import React, { useCallback, useEffect, useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api, firstError } from '../lib/api';
import { btnGhost, btnPrimary, inputCls } from '../components/cms/ContentFieldsForm';

interface Member { userId: string; fullName: string; email: string; userActive: boolean; membershipActive: boolean; roles: string[] }
interface RoleInfo { name: string; permissions: string[]; isSystem: boolean }
interface Lookup { userId: string; fullName: string; email: string; isActive: boolean; isMember: boolean }

/** SuperAdmin only. Users here are EXISTING accounts of the shared identity system; this screen can assign them to the
 *  Netrokona application and manage their Netrokona roles. It cannot create accounts or touch other applications. */
export const MembersAdmin: React.FC = () => {
  const { can } = useAuth();
  const { language } = useLanguage();
  const bn = language === 'bn';
  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [perms, setPerms] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [found, setFound] = useState<Lookup | null>(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    try {
      setMembers(await api<Member[]>('/api/admin/members'));
      const r = await api<{ roles: RoleInfo[]; permissions: string[] }>('/api/admin/members/roles');
      setRoles(r.roles); setPerms(r.permissions);
    } catch (e) { setMsg(firstError(e)); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const guard = async (fn: () => Promise<void>) => { setMsg(''); try { await fn(); await load(); } catch (e) { setMsg(firstError(e)); } };

  const lookup = async () => { setFound(null); setMsg(''); try { setFound(await api<Lookup>('/api/admin/members/lookup?email=' + encodeURIComponent(email.trim()))); } catch (e) { setMsg(firstError(e)); } };
  const assign = () => guard(async () => { if (found) { const r = await api<{ message: string }>('/api/admin/members', { json: { userId: found.userId } }); setMsg(r.message); setFound(null); setEmail(''); } });
  const setRolesFor = (m: Member, role: string, on: boolean) =>
    guard(() => api('/api/admin/members/' + m.userId + '/roles', { method: 'PUT', json: { roles: on ? [...m.roles, role] : m.roles.filter((r) => r !== role) } }));
  const remove = (m: Member) => guard(async () => { if (window.confirm(bn ? `${m.email}-কে এই অ্যাপ্লিকেশন থেকে সরাবেন? (গ্লোবাল অ্যাকাউন্ট থাকবে)` : `Remove ${m.email} from this application? (The global account stays.)`)) await api('/api/admin/members/' + m.userId, { method: 'DELETE' }); });
  const togglePerm = (r: RoleInfo, p: string) =>
    guard(() => api(`/api/admin/members/roles/${encodeURIComponent(r.name)}/permissions`, { method: 'PUT', json: { permissions: r.permissions.includes(p) ? r.permissions.filter((x) => x !== p) : [...r.permissions, p] } }));

  const card = 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3';
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{bn ? 'সদস্য ও ভূমিকা' : 'Members & roles'}</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {bn ? 'অ্যাকাউন্ট তৈরি হয় কেন্দ্রীয় আইডেন্টিটি সিস্টেমে। এখানে শুধু বিদ্যমান ব্যবহারকারীকে নেত্রকোণা অ্যাপ্লিকেশনে যুক্ত করে ভূমিকা দেওয়া যায়।' : 'Accounts are created in the central identity system. Here you can only add an existing user to the Netrokona application and give them Netrokona roles.'}
      </p>
      {msg && <p role="status" className="text-sm text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2">{msg}</p>}

      <div className={card}>
        <h2 className="font-bold text-slate-900 dark:text-slate-100">{bn ? 'বিদ্যমান ব্যবহারকারী যুক্ত করুন' : 'Add an existing user'}</h2>
        <div className="flex gap-2 flex-wrap">
          <input className={`${inputCls} flex-1 min-w-52`} type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className={btnGhost} onClick={lookup} disabled={!email.trim()}>{bn ? 'খুঁজুন' : 'Look up'}</button>
        </div>
        {found && (
          <div className="flex items-center justify-between gap-3 flex-wrap text-sm text-slate-800 dark:text-slate-100">
            <span><b>{found.fullName}</b> · {found.email} {!found.isActive && '(inactive)'}</span>
            {found.isMember ? <em>{bn ? 'ইতিমধ্যে সদস্য' : 'Already a member'}</em> : <button className={`${btnPrimary} inline-flex items-center gap-2`} onClick={assign}><UserPlus className="w-4 h-4" />{bn ? 'যুক্ত করুন' : 'Assign to Netrokona'}</button>}
          </div>
        )}
      </div>

      <div className={card}>
        <h2 className="font-bold text-slate-900 dark:text-slate-100">{bn ? 'সদস্যবৃন্দ' : 'Members'}</h2>
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.userId} className={`rounded-xl border border-slate-200 dark:border-slate-700 p-3 ${m.membershipActive ? '' : 'opacity-50'}`}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{m.fullName} <span className="font-normal text-slate-500">· {m.email}</span></p>
                {m.membershipActive && <button aria-label="remove" className="text-red-600 cursor-pointer" onClick={() => remove(m)}><Trash2 className="w-4 h-4" /></button>}
              </div>
              {m.membershipActive && (
                <div className="flex gap-3 flex-wrap mt-2">
                  {roles.map((r) => (
                    <label key={r.name} className="text-xs flex items-center gap-1 text-slate-700 dark:text-slate-200">
                      <input type="checkbox" checked={m.roles.includes(r.name)} onChange={(e) => setRolesFor(m, r.name, e.target.checked)} />{r.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {can('roles.manage') && (
        <div className={`${card} overflow-x-auto`}>
          <h2 className="font-bold text-slate-900 dark:text-slate-100">{bn ? 'ভূমিকা ও অনুমতি (শুধু এই অ্যাপ্লিকেশন)' : 'Role permissions (this application only)'}</h2>
          <table className="text-xs text-slate-800 dark:text-slate-100">
            <thead><tr><th className="text-left pr-4 pb-2">{bn ? 'অনুমতি' : 'Permission'}</th>{roles.map((r) => <th key={r.name} className="px-2 pb-2">{r.name}</th>)}</tr></thead>
            <tbody>
              {perms.map((p) => (
                <tr key={p} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="pr-4 py-1 font-mono">{p}</td>
                  {roles.map((r) => (
                    <td key={r.name} className="text-center">
                      <input type="checkbox" checked={r.permissions.includes(p)} disabled={r.name === 'SuperAdmin'} onChange={() => togglePerm(r, p)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
