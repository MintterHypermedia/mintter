import {
  Account,
  ChangeInfo,
  Document,
  Group,
  HMDocument,
  HMGroup,
  HMPublication,
  MttLink,
  Publication,
} from '@mintter/shared'
import {HMAccount, HMChangeInfo, HMLink} from '@mintter/shared/src/json-hm'

export function hmPublication(
  input?: Publication | null,
): HMPublication | null {
  if (!input) return null
  return input.toJson() as HMPublication
}

export function hmDocument(input?: Document | null): HMDocument | null {
  if (!input) return null
  return input.toJson() as HMDocument
}

export function hmAccount(input?: Account | null) {
  if (!input) return null
  return input.toJson() as HMAccount
}

export function hmGroup(input?: Group | null) {
  if (!input) return null
  return input.toJson() as HMGroup
}

export function hmChangeInfo(input?: ChangeInfo | null) {
  if (!input) return null
  return input.toJson() as HMChangeInfo
}

export function hmLink(input?: MttLink) {
  if (!input) return null
  return input.toJson() as HMLink
}
