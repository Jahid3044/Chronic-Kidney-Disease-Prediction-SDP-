import os
import subprocess
import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "frontend"


def start_process(command, working_directory):
    return subprocess.Popen(command, cwd=working_directory)


def main():
    backend = start_process(
        [sys.executable, "main.py"],
        BACKEND_DIR,
    )
    frontend = start_process(
        [sys.executable, "-m", "http.server", "3000"],
        FRONTEND_DIR,
    )

    print("Backend:  http://127.0.0.1:8000")
    print("Frontend: http://127.0.0.1:3000")
    print("Press Ctrl+C to stop both services.")

    try:
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        pass
    finally:
        for process in (backend, frontend):
            if process.poll() is None:
                process.terminate()
        for process in (backend, frontend):
            process.wait()


if __name__ == "__main__":
    main()