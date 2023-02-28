# Mintter

Mintter is a decentralized knowledge collaboration application for open
communities powered by a knowledge graph.

You can read more about the product and why we are here on our website:
https://mintter.com

## ⚠️ Stability

This is alpha-quality software. Have a copy of anything valuable you put into
Mintter.

We expect to make a breaking (incompatible) change to the data model in
following weeks.

## Building

You can build the project on Linux, macOS, and Windows. Although using Windows
for active development is probably going to be painful (unless using WSL).

The setup for Linux, and macOS is simplified using the
[Nix Package Manager](https://nixos.org/nix), and [Direnv](https://direnv.net).
The setup on Linux is a bit more involved due to dependencies on system
libraries that don't work well on non-NixOS Linux distros.

The bare minimum required for compilation is to have Rust, Go, and NodeJS
toolchains installed.

See the [developer setup](./docs/dev-setup.md) page for more info on how to
build the project.

## Docker
You can build docker images for different modules of the system. Always from
the repo root path you can issue the following commands:

daemon: `docker build -t mintterd . -f ./backend/cmd/mintterd/Dockerfile`

gateway: `docker build -t gateway . -f ./frontend/gateway/Dockerfile`

### Deploy a Site
One can also take advantage of the above modules and deploy a mintter site
on a public server (or locally for testing it out).
For that purpose, there is a simple docker-compose file that should bundle 
the necessary modules:
```bash
docker compose --profile base up -d
```
This command will spin op the new site on http://127.0.0.1:3000. If you want 
to customize the site and deployment, generate a `.env` file and place
it in the same folder as the `docker-compose.yml` file. Example `.env` file:
```yaml
MTT_SITE_HOSTNAME=https://example.com # Your domain. Remember to add the protocol [http(s)://] add https even if its ssl terminated somewhere else
MTT_SITE_OWNER_ACCOUNT_ID=bahezrj4iaqacicabciqfnrov4niome6csw43r244roia35q6fiak75bmapk2zjudj3uffea # The mintter account ID of the owner of the site 
MTT_SITE_WORKSPACE=~/.mtt-site # Directory where all the site data will be stored. 
MTT_SITE_BACKEND_P2P_PORT=56000 # The port where the local backend will talk to the p2p network. (To get the documents)
MTT_SITE_BACKEND_GRPCWEB_PORT=56001 # The port through which the local backend and the gateway communicate each other.
```
If the domain in `MTT_SITE_HOSTNAME` is publicly accessible (not 
`http://127.0.0.1`) and you want local ssl termination, then start docker 
with the following command:
```bash
docker compose --profile ssl up
```