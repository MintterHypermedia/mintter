import argparse
import hashlib
import os
import stat
import subprocess
import sys
from dataclasses import dataclass
from os import path

# This script is meant to be called from within 'plz run'. It depends
# on the environment variables set by Please.


def hash_files(files: list) -> str:
    md5 = hashlib.md5()
    for f in files:
        f = open(f, "rb")
        md5.update(f.read())
        f.close()
    return md5.hexdigest()


@dataclass
class Gensum:
    srcs_hash: str
    outs_hash: str


def read_gensum(filename: str) -> Gensum:
    with open(filename, "r") as f:
        lines = f.read().split("\n")
        return Gensum(
            srcs_hash=lines[0].strip("srcs: "),
            outs_hash=lines[1].strip("outs: "),
        )


def stamp_file(f: str) -> int:
    st = os.stat(f)
    if stat.S_ISDIR(st.st_mode):
        raise Exception("can't stamp directories")

    return int(st.st_mtime)


def check(srcs: list, outs: list, checksum_file: str):
    # To avoid reading and hashing files every time we check the mtime first,
    # in a similar way `make` would do.
    def do_check():
        gensum = read_gensum(checksum_file)
        srcs_hash = hash_files(srcs)
        outs_hash = hash_files(outs)

        if srcs_hash != gensum.srcs_hash:
            print("srcs hash is not the same")
            return sys.exit(1)

        if outs_hash != gensum.outs_hash:
            print("outs hash is not the same")
            return sys.exit(1)

        subprocess.run("touch " + checksum_file, shell=True, check=True)
        return sys.exit(0)

    gensum_stamp = stamp_file(checksum_file)

    for s in srcs:
        if stamp_file(s) > gensum_stamp:
            return do_check()

    for o in outs:
        if stamp_file(o) > gensum_stamp:
            return do_check()

    print("nothing to check")


def gen(srcs: list, outs: list, checksum_file: str, cmd: str):
    cmd_env = {
        "SRCS": os.getenv("SRCS"),
        "OUTS": os.getenv("OUTS"),
        "WORKSPACE": os.getenv("WORKSPACE"),
        "PATH": "/bin:/usr/bin:/sbin",
        "HOME": os.getenv("HOME"),
        "PKG": os.getenv("PKG"),
        "NAME": os.getenv("NAME"),
    }

    for k, v in os.environ.items():
        if k.startswith("TOOLS_"):
            cmd_env[k] = path.join(cmd_env.get("WORKSPACE"), v)

    subprocess.run(cmd, check=True, shell=True, env=cmd_env)

    with open(checksum_file, "w") as f:
        f.write("srcs: ")
        f.write(hash_files(srcs))
        f.write('\n')
        f.write("outs: ")
        f.write(hash_files(outs))
        f.write('\n')

    return sys.exit(0)


def clean(srcs: list, outs: list, checksum_file: str):
    for o in outs:
        os.remove(o)
    os.remove(checksum_file)
    return sys.exit(0)


def main():
    cli = argparse.ArgumentParser()
    cli.add_argument("command", nargs='?',
                     help="command used to generate (only used if --action=gen)")
    cli.add_argument("--action", choices=["clean", "check", "gen"])

    args = cli.parse_args()
    if len(sys.argv) == 1:
        cli.print_help()
        return

    srcs = os.getenv("SRCS").split(" ")
    outs = os.getenv("OUTS").split(" ")
    checksum_file = os.getenv("CHECKSUM_FILE")

    if args.action == "check":
        return check(srcs, outs, checksum_file)

    if args.action == "gen":
        return gen(srcs, outs, checksum_file, args.command)

    if args.action == "clean":
        return clean(srcs, outs, checksum_file)


if __name__ == "__main__":
    try:
        main()
    except Exception as err:
        print(err)
        sys.exit(1)
