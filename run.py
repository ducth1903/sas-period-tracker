import socket
import os

FILES_CONTAINS_LOCAL_IP = [
    os.path.join(os.getcwd(), 'mobile', 'Dockerfile'),
    os.path.join(os.getcwd(), 'mobile', '.env'),
    os.path.join(os.getcwd(), 'server', '.env'),
]

def find_local_ip() -> str:
    """
    Find local IP address (192.168.x.x or 10.0.x.x)
    """
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    local_pi = s.getsockname()[0]
    s.close()
    return local_pi

if __name__ == "__main__":
    local_ip = find_local_ip()
    print(local_ip)
    for current_file in FILES_CONTAINS_LOCAL_IP:
        with open(current_file, "r") as f:
            content = f.read()

        content = content.format(local_ip)

        with open(current_file, "w") as f:
            f.write(content)