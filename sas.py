"""
Helper function to initialize the project,
such as retrieving local IP and set it in environment and Dockerfile
"""

import argparse
import socket
import os

FILES_CONTAINS_LOCAL_IP = [
    os.path.join(os.getcwd(), 'mobile', 'Dockerfile'),
    os.path.join(os.getcwd(), 'mobile', '.env'),
    os.path.join(os.getcwd(), 'server', '.env'),
]


def get_local_ip() -> str:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    local_ip = s.getsockname()[0]
    s.close()
    return local_ip


def overwrite_env(local_ip=None) -> None:
    """
    Overwwrite .env with local IP address
    """
    if not local_ip:
        local_ip = get_local_ip()

    for current_file in FILES_CONTAINS_LOCAL_IP:
        with open(current_file, "r") as f:
            content = f.read()

        content = content.format(local_ip)

        with open(current_file, "w") as f:
            f.write(content)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-getip', action="store_true")
    parser.add_argument('-overwrite-env', action="store_true")
    args = parser.parse_args()

    if args.getip:
        print(get_local_ip())

    if args.overwrite_env:
        overwrite_env()


if __name__ == "__main__":
    main()
