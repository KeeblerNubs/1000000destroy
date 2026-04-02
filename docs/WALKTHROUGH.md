# Windows 10 lab walkthrough

This guide keeps the project usable on modern Windows 10 hosts (or VMs) with WSL2 and Docker Desktop. All steps assume you are working on a disposable machine that can be rolled back with a snapshot.

## 1) Prepare the environment

### Windows 10 settings
- Enable virtualization in BIOS/UEFI, then enable Hyper-V + WSL2:
  ```powershell
  dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
  dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
  wsl --set-default-version 2
  ```
- Reboot after the commands so WSL2 and Hyper-V are fully applied.

### Install tooling (inside Windows, not WSL)
- Python 3.11+ (x64) from python.org. During install, select **Add Python to PATH**.
- Node.js 18+ (for the Electron UI).
- Docker Desktop (uses Hyper-V/WSL2; allow file sharing for your checkout drive).

## 2) Clone and set up
- Open **PowerShell** in your working folder:
  ```powershell
  git clone https://github.com/ashim-ad-nap/1000000destroy.git
  cd 1000000destroy
  py -3 -m venv .venv
  .\.venv\Scripts\Activate.ps1
  pip install -r requirements.txt
  ```
- If you are inside **WSL2**, swap `py -3` for `python3` and use Linux paths (e.g., `./malware/gif_embedder.py`).

## 3) Use the GIF embedder CLI
1. Place a GIF and payload file in the repo (e.g., `input.gif` and `payload.bin`).
2. Run the embed step:
   ```powershell
   python malware/gif_embedder.py embed .\input.gif .\payload.bin .\output-with-payload.gif
   ```
3. Verify extraction:
   ```powershell
   python malware/gif_embedder.py extract .\output-with-payload.gif .\extracted.bin
   ```
4. Compare hashes to ensure round-trip integrity:
   ```powershell
   Get-FileHash .\payload.bin, .\extracted.bin
   ```

**Docker alternative (no local Python needed):**
```powershell
# From the repo root
docker run --rm -v ${PWD}:/app -w /app python:3.12-slim ^
  python malware/gif_embedder.py embed input.gif payload.bin output-with-payload.gif
```
- On PowerShell, `^` is the line continuation; on CMD use `^`, on WSL use `\\` or a single line.
- If Docker Desktop prompts for file sharing, allow access to the drive containing the repo.

## 4) Run the Electron UI (Windows 10)
1. Install dependencies and start the app:
   ```powershell
   cd electron-app
   npm install
   npm start
   ```
2. **Embed tab:** pick a GIF, choose a payload, and select an output path.
3. **Extract tab:** select a GIF that contains a payload and choose where to save the extracted file.
4. If SmartScreen blocks the app, click **More info** → **Run anyway** (inside your VM only).

## 5) Destructive sample (VM only!)
- The script `malware/1000000destroy.py` attempts to take ownership of and delete Windows system binaries. Only run it in a throwaway VM:
  ```powershell
  cd malware
  python 1000000destroy.py
  ```
- After confirming the prompt, expect the VM to become unstable; shut it down without trusting the OS again.

## 6) Troubleshooting
- **Long paths or spaces (Windows):** wrap paths in quotes, e.g., `"C:\Users\LabUser\input gif.gif"`.
- **Defender quarantines files:** keep exclusions limited to the VM and only for the project folder. Remove the exclusion when done.
- **Docker bind mount fails on Windows 10:** ensure the drive is shared in Docker Desktop settings. Quick fix: move the repo to `C:\Users\Public` and retry; best practice: keep labs on a dedicated data drive that is shared.
- **WSL path confusion:** files inside `/mnt/c/...` are visible to Windows tools. If Node or Python in WSL cannot access Windows paths, copy the files into the WSL home directory.

## 7) Clean up
- Deactivate the Python venv: `deactivate` (PowerShell) or `source .venv/bin/deactivate` (WSL).
- Remove Docker images created during testing: `docker image prune`.
- Revert your VM to a clean snapshot before the next experiment.
