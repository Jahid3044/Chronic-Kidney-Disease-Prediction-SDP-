import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "frontend"


def port_is_open(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as connection:
        connection.settimeout(0.5)
        return connection.connect_ex(("127.0.0.1", port)) == 0


def backend_is_healthy():
    try:
        with urllib.request.urlopen("http://127.0.0.1:8000/health", timeout=1) as response:
            return response.status == 200
    except (OSError, urllib.error.URLError):
        return False


def start_process(command, working_directory):
    return subprocess.Popen(command, cwd=working_directory)


def get_backend_python():
    if sys.platform == "win32":
        virtualenv_python = BACKEND_DIR / "venv" / "Scripts" / "python.exe"
    else:
        virtualenv_python = BACKEND_DIR / "venv" / "bin" / "python"

    return str(virtualenv_python) if virtualenv_python.exists() else sys.executable


def wait_for_backend(process, timeout=15):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if process.poll() is not None:
            raise RuntimeError(
                f"Backend stopped during startup (exit code {process.returncode}). "
                "Install backend/requirements.txt in the project virtual environment."
            )
        if backend_is_healthy():
            return
        time.sleep(0.25)
    raise RuntimeError(f"Backend did not become healthy within {timeout} seconds.")


def main():
    backend = None
    frontend = None

    if backend_is_healthy():
        print("Backend already running on http://127.0.0.1:8000")
    else:
        backend = start_process([get_backend_python(), "main.py"], BACKEND_DIR)
        wait_for_backend(backend)

    if port_is_open(3000):
        print("Frontend already running on http://127.0.0.1:3000")
    else:
        frontend = start_process(
            [sys.executable, "-m", "http.server", "3000"],
            FRONTEND_DIR,
        )

    print("Backend:  http://127.0.0.1:8000")
    print("Frontend: http://127.0.0.1:3000")
    print("Press Ctrl+C to stop both services.")

    try:
        while True:
            if backend is not None and backend.poll() is not None:
                break
            if frontend is not None and frontend.poll() is not None:
                break
            if backend is None and frontend is None:
                input("Services are already running. Press Enter to close this task... ")
                break
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        for process in (backend, frontend):
            if process is not None and process.poll() is None:
                process.terminate()
        for process in (backend, frontend):
            if process is not None:
                process.wait()


if __name__ == "__main__":
    main()