import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from './Settings.module.css';

const TABS = [
  { id: 'users', label: 'Users' },
  { id: 'groups', label: 'Groups' },
  { id: 'roles', label: 'Roles' },
  // { id: 'permissions', label: 'Permissions' },
] as const;

const USERS = [
  { id: 'alice', name: 'Alice' },
  { id: 'bob', name: 'Bob' },
  { id: 'carol', name: 'Carol' },
];

const FIRST_USER_ID = USERS[0].id;

const ORGANIZATIONS = [
  { id: 'acme', name: 'Acme Corp' },
  { id: 'globex', name: 'Globex Industries' },
  { id: 'initech', name: 'Initech' },
];

const DEFAULT_ORG_BY_USER: Record<string, string> = {
  alice: 'acme',
  bob: 'globex',
  carol: 'initech',
};

const ALL_GROUPS = ['Developers', 'Guests', 'Admins'];

const DEFAULT_GROUPS_BY_USER: Record<string, string[]> = {
  alice: [...ALL_GROUPS],
  bob: [...ALL_GROUPS],
  carol: [...ALL_GROUPS],
};

const ALL_ROLES = ['Developer', 'Admin'];

const DEFAULT_ROLES_BY_USER: Record<string, string[]> = {
  alice: [...ALL_ROLES],
  bob: [...ALL_ROLES],
  carol: [...ALL_ROLES],
};

/** All permission names that can be assigned to a group. */
const ALL_PERMISSION_NAMES = [
  'Read project',
  'Create project',
  'Delete project',
  'View org members',
  'Manage org members',
];

const DEFAULT_GROUP_PERMISSIONS: Record<string, string[]> = {
  Developers: ['Read project', 'Create project', 'View org members'],
  Guests: ['Read project'],
  Admins: ['View org members', 'Manage org members', 'Create project', 'Read project', 'Delete project'],
};

const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  Developer: ['Read project', 'Create project'],
  Admin: ['View org members', 'Manage org members', 'Create project', 'Read project', 'Delete project'],
};

const ORG_PERMISSIONS = [
  { id: 'org:members.view', name: 'View org members', effective: 'user:deny', override: 'deny' as const },
  { id: 'org:members.manage', name: 'Manage org members', effective: 'user-role:allow (Admin)', override: 'inherited' as const },
];

const PROJECT_PERMISSIONS = [
  { id: 'project:create', name: 'Create project', effective: 'user-role:allow (Admin)', override: 'inherited' as const },
  { id: 'project:read', name: 'Read project', effective: 'user-role:allow (Admin)', override: 'inherited' as const },
  { id: 'project:delete', name: 'Delete project', effective: 'user-role:allow (Admin)', override: 'inherited' as const },
];

type PermOverride = 'inherited' | 'allow' | 'deny';

const defaultOrgOverrides: Record<string, PermOverride> = {
  'org:members.view': 'deny',
  'org:members.manage': 'inherited',
};
const defaultProjectOverrides: Record<string, PermOverride> = {
  'project:create': 'inherited',
  'project:read': 'inherited',
  'project:delete': 'inherited',
};

function Settings() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('users');
  const [selectedUserId, setSelectedUserId] = useState<string>(FIRST_USER_ID);
  const [selectedOrgIdByUser, setSelectedOrgIdByUser] = useState<Record<string, string>>(DEFAULT_ORG_BY_USER);
  const [groupsByUser, setGroupsByUser] = useState<Record<string, string[]>>(DEFAULT_GROUPS_BY_USER);
  const [addMembershipOpen, setAddMembershipOpen] = useState(false);
  const [addMembershipSelected, setAddMembershipSelected] = useState<string>('');
  const [rolesByUser, setRolesByUser] = useState<Record<string, string[]>>(DEFAULT_ROLES_BY_USER);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [assignRoleSelected, setAssignRoleSelected] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>(ALL_GROUPS[0]);
  const [selectedRole, setSelectedRole] = useState<string>(ALL_ROLES[0]);
  const [orgPermOverridesByUser, setOrgPermOverridesByUser] = useState<Record<string, Record<string, PermOverride>>>({
    alice: { ...defaultOrgOverrides },
    bob: { ...defaultOrgOverrides },
    carol: { ...defaultOrgOverrides },
  });
  const [projectPermOverridesByUser, setProjectPermOverridesByUser] = useState<
    Record<string, Record<string, PermOverride>>
  >({
    alice: { ...defaultProjectOverrides },
    bob: { ...defaultProjectOverrides },
    carol: { ...defaultProjectOverrides },
  });
  const [permissionsByGroup, setPermissionsByGroup] = useState<Record<string, string[]>>(DEFAULT_GROUP_PERMISSIONS);
  const [addGroupPermissionOpen, setAddGroupPermissionOpen] = useState(false);
  const [addGroupPermissionSelected, setAddGroupPermissionSelected] = useState<string>('');
  const [permissionsByRole, setPermissionsByRole] = useState<Record<string, string[]>>(DEFAULT_ROLE_PERMISSIONS);
  const [addRolePermissionOpen, setAddRolePermissionOpen] = useState(false);
  const [addRolePermissionSelected, setAddRolePermissionSelected] = useState<string>('');

  const orgPermOverrides = orgPermOverridesByUser[selectedUserId] ?? defaultOrgOverrides;
  const projectPermOverrides = projectPermOverridesByUser[selectedUserId] ?? defaultProjectOverrides;

  const cycleOverride = (current: PermOverride): PermOverride =>
    current === 'inherited' ? 'allow' : current === 'allow' ? 'deny' : 'inherited';

  const handleOrgPermClick = (permId: string) => {
    setOrgPermOverridesByUser((prev) => ({
      ...prev,
      [selectedUserId]: {
        ...(prev[selectedUserId] ?? defaultOrgOverrides),
        [permId]: cycleOverride(orgPermOverrides[permId] ?? 'inherited'),
      },
    }));
  };

  const handleProjectPermClick = (permId: string) => {
    setProjectPermOverridesByUser((prev) => ({
      ...prev,
      [selectedUserId]: {
        ...(prev[selectedUserId] ?? defaultProjectOverrides),
        [permId]: cycleOverride(projectPermOverrides[permId] ?? 'inherited'),
      },
    }));
  };

  const groups = groupsByUser[selectedUserId] ?? [...ALL_GROUPS];
  const availableGroups = ALL_GROUPS.filter((g) => !groups.includes(g));
  const roles = rolesByUser[selectedUserId] ?? [...ALL_ROLES];
  const availableRoles = ALL_ROLES.filter((r) => !roles.includes(r));
  const selectedOrgId = selectedOrgIdByUser[selectedUserId] ?? DEFAULT_ORG_BY_USER[selectedUserId] ?? '';
  const assignedPermissionsForGroup = selectedGroup ? (permissionsByGroup[selectedGroup] ?? []) : [];
  const availablePermissionsForGroup = ALL_PERMISSION_NAMES.filter((p) => !assignedPermissionsForGroup.includes(p));
  const assignedPermissionsForRole = selectedRole ? (permissionsByRole[selectedRole] ?? []) : [];
  const availablePermissionsForRole = ALL_PERMISSION_NAMES.filter((p) => !assignedPermissionsForRole.includes(p));

  const handleRemoveGroup = (groupName: string) => {
    setGroupsByUser((prev) => ({
      ...prev,
      [selectedUserId]: (prev[selectedUserId] ?? []).filter((g) => g !== groupName),
    }));
  };

  const handleAddMembership = () => {
    if (!addMembershipSelected) return;
    const current = groupsByUser[selectedUserId] ?? [];
    if (current.includes(addMembershipSelected)) return;
    setGroupsByUser((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] ?? []), addMembershipSelected],
    }));
    setAddMembershipOpen(false);
    setAddMembershipSelected('');
  };

  const handleRemoveRole = (roleName: string) => {
    setRolesByUser((prev) => ({
      ...prev,
      [selectedUserId]: (prev[selectedUserId] ?? []).filter((r) => r !== roleName),
    }));
  };

  const handleAssignRole = () => {
    if (!assignRoleSelected) return;
    const current = rolesByUser[selectedUserId] ?? [];
    if (current.includes(assignRoleSelected)) return;
    setRolesByUser((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] ?? []), assignRoleSelected],
    }));
    setAssignRoleOpen(false);
    setAssignRoleSelected('');
  };

  const handleRemoveGroupPermission = (permName: string) => {
    if (!selectedGroup) return;
    setPermissionsByGroup((prev) => ({
      ...prev,
      [selectedGroup]: (prev[selectedGroup] ?? []).filter((p) => p !== permName),
    }));
  };

  const handleAddGroupPermission = () => {
    if (!selectedGroup || !addGroupPermissionSelected) return;
    const current = permissionsByGroup[selectedGroup] ?? [];
    if (current.includes(addGroupPermissionSelected)) return;
    setPermissionsByGroup((prev) => ({
      ...prev,
      [selectedGroup]: [...(prev[selectedGroup] ?? []), addGroupPermissionSelected],
    }));
    setAddGroupPermissionOpen(false);
    setAddGroupPermissionSelected('');
  };

  const handleRemoveRolePermission = (permName: string) => {
    if (!selectedRole) return;
    setPermissionsByRole((prev) => ({
      ...prev,
      [selectedRole]: (prev[selectedRole] ?? []).filter((p) => p !== permName),
    }));
  };

  const handleAddRolePermission = () => {
    if (!selectedRole || !addRolePermissionSelected) return;
    const current = permissionsByRole[selectedRole] ?? [];
    if (current.includes(addRolePermissionSelected)) return;
    setPermissionsByRole((prev) => ({
      ...prev,
      [selectedRole]: [...(prev[selectedRole] ?? []), addRolePermissionSelected],
    }));
    setAddRolePermissionOpen(false);
    setAddRolePermissionSelected('');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Permissions</h1>
        <p className={styles.subtitle}>Manage users, groups, roles, and permissions</p>
        <nav className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <div className={styles.layout}>
        {activeTab === 'groups' ? (
          <>
            <aside className={styles.aside}>
              <label className={styles.label} htmlFor="admin-select-group">
                Select a group
              </label>
              <select
                id="admin-select-group"
                className={styles.userSelect}
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                {ALL_GROUPS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </aside>
            <main className={styles.main}>
              <section className={styles.panel}>
                <div className={styles.panelTitleRow}>
                  <h3 className={styles.panelTitle}>Assigned permissions</h3>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => {
                      setAddGroupPermissionOpen(true);
                      setAddGroupPermissionSelected('');
                    }}
                  >
                    Add permission
                  </button>
                </div>
                {assignedPermissionsForGroup.length === 0 ? (
                  <p className={styles.permHelp}>No permissions assigned to this group.</p>
                ) : (
                  <ul className={styles.groupList}>
                    {assignedPermissionsForGroup.map((perm) => (
                      <li key={perm} className={styles.groupItem}>
                        <span className={styles.groupName}>{perm}</span>
                        <button
                          type="button"
                          className={styles.btnRemove}
                          onClick={() => handleRemoveGroupPermission(perm)}
                          aria-label={`Remove ${perm}`}
                        >
                          <Trash2 size={18} strokeWidth={1.8} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {addGroupPermissionOpen && (
                <div
                  className={styles.modalBackdrop}
                  onClick={() => setAddGroupPermissionOpen(false)}
                  role="presentation"
                >
                  <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="add-group-permission-title"
                  >
                    <h2 id="add-group-permission-title" className={styles.modalTitle}>
                      Add permission
                    </h2>
                    <label className={styles.label} htmlFor="add-group-permission-dropdown">
                      Permission
                    </label>
                    <select
                      id="add-group-permission-dropdown"
                      className={styles.select}
                      value={addGroupPermissionSelected}
                      onChange={(e) => setAddGroupPermissionSelected(e.target.value)}
                    >
                      <option value="" disabled>
                        Add permission
                      </option>
                      {availablePermissionsForGroup.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <div className={styles.modalActions}>
                      <button type="button" className={styles.btnSecondary} onClick={() => setAddGroupPermissionOpen(false)}>
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={handleAddGroupPermission}
                        disabled={!addGroupPermissionSelected}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </>
        ) : activeTab === 'roles' ? (
          <>
            <aside className={styles.aside}>
              <label className={styles.label} htmlFor="admin-select-role">
                Select a role
              </label>
              <select
                id="admin-select-role"
                className={styles.userSelect}
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {ALL_ROLES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </aside>
            <main className={styles.main}>
              <section className={styles.panel}>
                <div className={styles.panelTitleRow}>
                  <h3 className={styles.panelTitle}>Assigned permissions</h3>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => {
                      setAddRolePermissionOpen(true);
                      setAddRolePermissionSelected('');
                    }}
                  >
                    Add permission
                  </button>
                </div>
                {assignedPermissionsForRole.length === 0 ? (
                  <p className={styles.permHelp}>No permissions assigned to this role.</p>
                ) : (
                  <ul className={styles.groupList}>
                    {assignedPermissionsForRole.map((perm) => (
                      <li key={perm} className={styles.groupItem}>
                        <span className={styles.groupName}>{perm}</span>
                        <button
                          type="button"
                          className={styles.btnRemove}
                          onClick={() => handleRemoveRolePermission(perm)}
                          aria-label={`Remove ${perm}`}
                        >
                          <Trash2 size={18} strokeWidth={1.8} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {addRolePermissionOpen && (
                <div
                  className={styles.modalBackdrop}
                  onClick={() => setAddRolePermissionOpen(false)}
                  role="presentation"
                >
                  <div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="add-role-permission-title"
                  >
                    <h2 id="add-role-permission-title" className={styles.modalTitle}>
                      Add permission
                    </h2>
                    <label className={styles.label} htmlFor="add-role-permission-dropdown">
                      Permission
                    </label>
                    <select
                      id="add-role-permission-dropdown"
                      className={styles.select}
                      value={addRolePermissionSelected}
                      onChange={(e) => setAddRolePermissionSelected(e.target.value)}
                    >
                      <option value="" disabled>
                        Add permission
                      </option>
                      {availablePermissionsForRole.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <div className={styles.modalActions}>
                      <button type="button" className={styles.btnSecondary} onClick={() => setAddRolePermissionOpen(false)}>
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={handleAddRolePermission}
                        disabled={!addRolePermissionSelected}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </>
        ) : (
          <>
            <aside className={styles.aside}>
              <label className={styles.label} htmlFor="admin-select-user">
                Select a user
              </label>
              <select
                id="admin-select-user"
                className={styles.userSelect}
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="" disabled>
                  Select a user
                </option>
                {USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </aside>

            <main className={styles.main}>
              <section className={styles.panel}>
                <label className={styles.label} htmlFor="admin-org">
                  Organization:
                </label>
            <select
              id="admin-org"
              className={styles.select}
              value={selectedOrgId}
              onChange={(e) =>
                setSelectedOrgIdByUser((prev) => ({ ...prev, [selectedUserId]: e.target.value }))
              }
            >
              <option value="">(none)</option>
              {ORGANIZATIONS.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
              <h3 className={styles.panelTitle}>Group Memberships ({groups.length})</h3>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => {
                  setAddMembershipOpen(true);
                  setAddMembershipSelected('');
                }}
              >
                Add to Group
              </button>
            </div>
            <ul className={styles.groupList}>
              {groups.map((name) => (
                <li key={name} className={styles.groupItem}>
                  <span className={styles.groupName}>{name}</span>
                  <button
                    type="button"
                    className={styles.btnRemove}
                    onClick={() => handleRemoveGroup(name)}
                    aria-label={`Remove ${name}`}
                  >
                    <Trash2 size={18} strokeWidth={1.8} />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {addMembershipOpen && (
            <div
              className={styles.modalBackdrop}
              onClick={() => setAddMembershipOpen(false)}
              role="presentation"
            >
              <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-membership-title"
              >
                <h2 id="add-membership-title" className={styles.modalTitle}>
                  Add membership
                </h2>
                <label className={styles.label} htmlFor="add-membership-dropdown">
                  Group
                </label>
                <select
                  id="add-membership-dropdown"
                  className={styles.select}
                  value={addMembershipSelected}
                  onChange={(e) => setAddMembershipSelected(e.target.value)}
                >
                  <option value="" disabled>
                    Add membership
                  </option>
                  {availableGroups.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setAddMembershipOpen(false)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleAddMembership}
                    disabled={!addMembershipSelected}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
              <h3 className={styles.panelTitle}>Role Assignments ({roles.length})</h3>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => {
                  setAssignRoleOpen(true);
                  setAssignRoleSelected('');
                }}
              >
                Assign Role
              </button>
            </div>
            <div className={styles.roleList}>
              {roles.map((role) => (
                <span key={role} className={styles.roleTag}>
                  {role}
                  <button
                    type="button"
                    className={styles.roleTagRemove}
                    aria-label={`Remove ${role}`}
                    onClick={() => handleRemoveRole(role)}
                  >
                    <Trash2 size={14} strokeWidth={1.8} />
                  </button>
                </span>
              ))}
            </div>
          </section>

          {assignRoleOpen && (
            <div
              className={styles.modalBackdrop}
              onClick={() => setAssignRoleOpen(false)}
              role="presentation"
            >
              <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="assign-role-title"
              >
                <h2 id="assign-role-title" className={styles.modalTitle}>
                  Assign role
                </h2>
                <label className={styles.label} htmlFor="assign-role-dropdown">
                  Role
                </label>
                <select
                  id="assign-role-dropdown"
                  className={styles.select}
                  value={assignRoleSelected}
                  onChange={(e) => setAssignRoleSelected(e.target.value)}
                >
                  <option value="" disabled>
                    Assign role
                  </option>
                  {availableRoles.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setAssignRoleOpen(false)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleAssignRole}
                    disabled={!assignRoleSelected}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Permission Overrides panel (Users tab) – commented out
          <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
              <h3 className={styles.panelTitle}>Permission Overrides</h3>
              <button type="button" className={styles.btnPrimary}>Add permission</button>
            </div>
            <p className={styles.permHelp}>Click to cycle: (inherited) → ALLOW → DENY → (inherited)</p>
            <h4 className={styles.permSectionTitle}>ORGANIZATION</h4>
            <div className={styles.permList}>
              {Object.entries(orgPermOverrides).map(([permId, override]) => {
                const perm = ORG_PERMISSIONS.find((p) => p.id === permId);
                if (!perm) return null;
                return (
                  <div key={perm.id} className={styles.permRow}>
                    <div className={styles.permInfo}>
                      <div className={styles.permName}>{perm.name}</div>
                      <div className={styles.permId}>{perm.id}</div>
                      <div className={styles.permEffective}>Effective: {perm.effective}</div>
                    </div>
                    <div className={styles.permRowActions}>
                      <button type="button" className={styles.permBadge} onClick={() => handleOrgPermClick(perm.id)}>...</button>
                      <button type="button" className={styles.btnRemove} aria-label="Remove"><Trash2 size={18} strokeWidth={1.8} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
            <h4 className={styles.permSectionTitle}>PROJECT</h4>
            <div className={styles.permList}>
              {Object.entries(projectPermOverrides).map(([permId, override]) => {
                const perm = PROJECT_PERMISSIONS.find((p) => p.id === permId);
                if (!perm) return null;
                return (
                  <div key={perm.id} className={styles.permRow}>
                    <div className={styles.permInfo}>
                      <div className={styles.permName}>{perm.name}</div>
                      <div className={styles.permId}>{perm.id}</div>
                      <div className={styles.permEffective}>Effective: {perm.effective}</div>
                    </div>
                    <div className={styles.permRowActions}>
                      <button type="button" className={styles.permBadge} onClick={() => handleProjectPermClick(perm.id)}>...</button>
                      <button type="button" className={styles.btnRemove} aria-label="Remove"><Trash2 size={18} strokeWidth={1.8} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          */}
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default Settings;
