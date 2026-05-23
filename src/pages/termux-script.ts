export const prerender = true;

import type { APIRoute } from 'astro';

const installer = `#!/usr/bin/env sh
set -eu

tmp_dir="\${TMPDIR:-$HOME/tmp}"
tmp_file="$tmp_dir/dotfiles-install-termux.sh"

curl_works() {
  command -v curl >/dev/null 2>&1 && curl --version >/dev/null 2>&1
}

repair_termux_curl() {
  if curl_works; then
    return 0
  fi

  printf '%s\\n' "curl est cassé ou manquant; réparation des paquets Termux..."

  if ! command -v apt >/dev/null 2>&1; then
    printf '%s\\n' "apt est indisponible, réparation automatique impossible."
    return 1
  fi

  apt update </dev/null >/dev/null 2>&1
  apt full-upgrade -y </dev/null >/dev/null 2>&1
  apt install --reinstall curl openssl libngtcp2 -y </dev/null >/dev/null 2>&1 || apt install curl openssl libngtcp2 -y </dev/null >/dev/null 2>&1

  curl_works
}

mkdir -p "$tmp_dir"
repair_termux_curl
curl -fsSL https://raw.githubusercontent.com/dianedef/dotfiles/d618a20cf71f58e32f184b0dadd934cc23ccf679/install-termux.sh -o "$tmp_file"
exec sh "$tmp_file"
`;

export const GET: APIRoute = () => {
  return new Response(installer, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
