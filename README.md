# 💣 1000000destroy: Python malware lab (Windows focus)

![Python](https://img.shields.io/badge/Python-3.11-blue.svg) ![Malware](https://img.shields.io/badge/Malware-Educational-red.svg) ![Windows](https://img.shields.io/badge/Windows-10%2B-orange.svg)

This repository contains destructive sample code that targets Windows. It exists for **education and analysis only**—never run it on a host you care about. Prefer an isolated Windows 10 virtual machine or a sandboxed container.

The repo also includes a benign GIF payload embedder (CLI + Electron UI) so you can practice packing and unpacking payloads without touching the destructive script.

## ⚠️ Safety first

- **Do not** execute `malware/1000000destroy.py` on a production or personal system. It attempts to take ownership of Windows system files and delete them.
- Use a Windows 10 VM or disposable cloud VM with snapshots. WSL2 is fine for the benign GIF tooling but cannot run the destructive script.
- If Windows Defender or another AV flags the binaries, keep them quarantined or add only temporary exclusions inside the VM. Never bypass security controls on your daily driver.

## 🧰 What’s inside

- `malware/1000000destroy.py`: destructive sample script (educational only).
- `malware/gif_embedder.py`: pure-Python CLI to embed/extract arbitrary payloads inside a GIF.
- `electron-app/`: cross-platform Electron GUI that wraps the embedder for Windows 10 users.
- `requirements.txt`: Python dependencies for the scripts (playsound only).

## 🚀 Quick start (benign tools)

```powershell
# Windows 10/11 PowerShell
git clone https://github.com/ashim-ad-nap/1000000destroy.git
cd 1000000destroy
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Embed a payload into a GIF:

```powershell
python malware/gif_embedder.py embed .\example.gif .\payload.bin .\with_payload.gif
```

Extract it later:

```powershell
python malware/gif_embedder.py extract .\with_payload.gif .\payload_out.bin
```

These commands are the same under WSL2: replace `py -3` with `python3` and use forward slashes for paths.

## 🪟 Windows 10 Electron helper

The UI runs anywhere Node.js and Electron are available. On Windows 10:

```powershell
cd electron-app
npm install
npm start
```

- Use **Embed** to select a GIF, choose a payload, and save the output file.
- Use **Extract** to point at a GIF with an embedded payload and save the extracted bytes.

If SmartScreen warns on first launch, choose **More info** → **Run anyway** inside your VM.

## 🐳 Run the GIF embedder in Docker (safer on Windows)

Running the CLI in a container keeps the host clean and avoids Python installs. With Docker Desktop + WSL2:

```powershell
# From the repo root
docker run --rm -v ${PWD}:/app -w /app python:3.12-slim \
  python malware/gif_embedder.py embed malware/sample.gif malware/payload.bin output/with_payload.gif
```

Replace the paths with your own GIF/payload. The output file lands in your working directory thanks to the bind mount.

## 🧨 Running the destructive sample (VM only)

> **Strong warning:** This script is intentionally destructive and will attempt to delete core Windows files. Only execute inside a disposable VM with snapshots.

```powershell
# Inside an isolated Windows VM
cd malware
python 1000000destroy.py
```

You will be prompted before execution. Terminate the VM afterward instead of trying to recover the OS.

## 📖 Walkthrough

For a step-by-step lab guide that covers Windows 10, WSL2, and Docker, see [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md).

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
