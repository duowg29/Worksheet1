export type SDKMessage = {
  eventType: string;
  eventData?: unknown;
};

interface AndroidYoTechSDK {
  onMessage: (message: string, origin: string) => void;
}

interface IOSYoTechSDK {
  postMessage: (message: string, origin: string) => void;
}

declare global {
  interface Window {
    YoTechSDK?: AndroidYoTechSDK;
    webkit?: { messageHandlers?: { YoTechSDK?: IOSYoTechSDK } };
  }
}

let messageHandler = (message: SDKMessage) => {
  console.log('Unhandled Message', JSON.stringify(message, null, 2));
};

window.addEventListener(
  'message',
  event => {
    try {
      let message: SDKMessage = JSON.parse(event.data);
      messageHandler(message);
    } catch (e) {
      messageHandler({ eventType: "ERROR", eventData: event.data });
    }
  },
  false
);

const yoTechSDK = {
  postMessage: (message: SDKMessage, origin: string) => {
    if (window.YoTechSDK) {
      window.YoTechSDK.onMessage(JSON.stringify(message), origin);
    } 
    else if (window.webkit?.messageHandlers?.YoTechSDK) {
      window.webkit.messageHandlers.YoTechSDK.postMessage(JSON.stringify(message), origin);
    }
    else {
      window.postMessage(message, origin);
    }
  },

  registerHandler: (handler: (message: SDKMessage) => void) => {
    messageHandler = handler;
  },

  startTimer: (duration: number, onUpdate: (timeLeft: number) => void, onEnd: () => void) => {
    let timeLeft = duration;
    const timer = setInterval(() => {
      timeLeft--;
      onUpdate(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timer);
        onEnd();
      }
    }, 1000);
    return timer;
  },

  updateProgressBar: (progressElement: HTMLElement, percent: number) => {
    progressElement.style.width = `${percent}%`;
  },

  showPopup: (message: string) => {
    alert(message);
  },

  toggleSettings: (settings: { music: boolean; sound: boolean; difficulty: string; theme: string }) => {
    console.log('Settings updated:', settings);
  },

  createGameButton: (text: string, onClick: () => void) => {
    const button = document.createElement('button');
    button.innerText = text;
    button.style.padding = '10px 20px';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.onclick = onClick;
    return button;
  },

  showFeedback: (isCorrect: boolean) => {
    const message = isCorrect ? 'Correct!' : 'Wrong!';
    alert(message);
  },
};

export default yoTechSDK;
