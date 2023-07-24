# ABR Streaming - Bandwidth Trajectory Editor
Adaptive Bitrate (ABR) Streaming is the de-facto standard for delivering video and audio content over the Internet. Dynamically adapting to the varying throughput on the client side is a key feature for media players. A testbed that simulates different network conditions based on pre-defined trajectories is a valuable tool to improve existing ABR algorithms in the media players. As part of this project you will implement a web-based editor to define different bandwidth trajectories. The editor is supposed to be an easy to use tool that outputs the graphically defined trajectory in JSON format, e.g [{duration:5000, speed:300},{duration:5000, speed:500}]. 

## How to get started

### Using VSCode Live Preview
When using [Visual Studio Code](https://code.visualstudio.com/), you can use the [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server) Plugin to start a local server which displays the webpage.
1. Open this folder's content as a new workspace in VSCode
2. Navigate to the `index.html` file
3. click the *Show Preview* in the top right of the window or
4. Using the Command Palette (`Ctrl / Command + Shift + P`):  *Live Preview: Show Preview*

### Python HTTP Server
Having Python 3 installed, you can use the `http` module to start a new HTTP server.
1. Navigate into the `src` folder
2. Run `python -m http.server 8000`
3. You now can access the webpage via [http://localhost:8000](http://localhost:8000)