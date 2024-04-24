export default function criarURL (root, params = {}) {
  if (root instanceof URL) root = root.href
  params = new URLSearchParams(params).toString()
  const token = !root.endsWith('?') && params ? '?' : ''
  return root + token + params
}
