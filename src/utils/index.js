const ffi = require('ffi-napi');
const robot = require('robotjs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const focusWindow = async (windowName) => {
  const user32 = new ffi.Library('user32', {
    GetTopWindow: ['long', ['long']],
    FindWindowA: ['long', ['string', 'string']],
    SetActiveWindow: ['long', ['long']],
    SetForegroundWindow: ['bool', ['long']],
    BringWindowToTop: ['bool', ['long']],
    ShowWindow: ['bool', ['long', 'int']],
    SwitchToThisWindow: ['void', ['long', 'bool']],
    GetForegroundWindow: ['long', []],
    AttachThreadInput: ['bool', ['int', 'long', 'bool']],
    GetWindowThreadProcessId: ['int', ['long', 'int']],
    SetWindowPos: [
      'bool',
      ['long', 'long', 'int', 'int', 'int', 'int', 'uint'],
    ],
    SetFocus: ['long', ['long']],
  });

  const kernel32 = new ffi.Library('Kernel32.dll', {
    GetCurrentThreadId: ['int', []],
  });

  const winToSetOnTop = user32.FindWindowA(null, windowName);
  const foregroundHWnd = user32.GetForegroundWindow();
  const currentThreadId = kernel32.GetCurrentThreadId();
  const windowThreadProcessId = user32.GetWindowThreadProcessId(
    foregroundHWnd,
    null
  );
  user32.ShowWindow(winToSetOnTop, 9);
  user32.SetWindowPos(winToSetOnTop, -1, 0, 0, 0, 0, 3);
  user32.SetWindowPos(winToSetOnTop, -2, 0, 0, 0, 0, 3);
  user32.SetForegroundWindow(winToSetOnTop);
  user32.AttachThreadInput(windowThreadProcessId, currentThreadId, 0);
  user32.SetFocus(winToSetOnTop);
  user32.SetActiveWindow(winToSetOnTop);

  await sleep(1000);
};

module.exports = { focusWindow, keyboard: robot, sleep };
