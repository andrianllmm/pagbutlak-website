import { createOwnerScopedAccess } from './createOwnerScopedAccess'

export const isAdminOrEditorOrOwner = createOwnerScopedAccess({
  allowedRoles: ['admin', 'editor'],
  ownerField: 'createdBy',
})
