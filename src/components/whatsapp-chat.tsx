import { Button } from '@/components/ui/button';
const adminPhoto = { url: '/__l5e/assets-v1/c097b21d-565c-4722-bd88-aea07fa6e2d0/51de6e3f-admin-photo.webp' };
import styles from '@/styles/whatsapp-chat.css?raw';

// Native disclosure and CSS own the widget; the shared inline listener handles only actions.
export function WhatsAppChat() {
  return <details className="whatsapp-chat">
    <summary className="africaVotesChat" title="WhatsApp" aria-label="Show Chat" aria-controls="africavotes-chat">
      <svg width="26" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#eceff1" d="M20.5 3.4A12.1 12.1 0 0012 0 12 12 0 001.7 17.8L0 24l6.3-1.7c2.8 1.5 5 1.4 5.8 1.5a12 12 0 008.4-20.3z" />
        <path fill="#4caf50" d="M12 21.8c-3.1 0-5.2-1.6-5.4-1.6l-3.7 1 1-3.7-.3-.4A9.9 9.9 0 012.1 12a10 10 0 0117-7 9.9 9.9 0 01-7 16.9z" />
        <path fill="#fafafa" d="M17.5 14.3c-.3 0-1.8-.8-2-.9-.7-.2-.5 0-1.7 1.3-.1.2-.3.2-.6.1s-1.3-.5-2.4-1.5a9 9 0 01-1.7-2c-.3-.6.4-.6 1-1.7l-.1-.5-1-2.2c-.2-.6-.4-.5-.6-.5-.6 0-1 0-1.4.3-1.6 1.8-1.2 3.6.2 5.6 2.7 3.5 4.2 4.2 6.8 5 .7.3 1.4.3 1.9.2.6 0 1.7-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" />
      </svg>
    </summary>
    <style>{styles}</style>
    <div id="africavotes-chat" role="dialog" aria-label="Chat with Fresh Teacher">
      <div className="header-chat">
        <div className="head-home">
          <div className="info-avatar">
            <img src={adminPhoto.url} alt="" />
          </div>
          <p>
            <span className="africavotes-name">Fresh Teacher</span>
            <br />
            <small className="wa-status"><span className="wa-online">online</span><span className="wa-typing-status">typing...</span></small>
          </p>
        </div>
        <div className="get-new hide">
          <div id="get-label" />
          <div id="get-nama" />
        </div>
      </div>
      <div className="home-chat" />
      <div className="start-chat">
        <div className="africavotes-chat-body">
          <div className="encryption-notice">
            <i className="fa-solid fa-lock" aria-hidden="true" />
            <span>Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. <Button variant="source" size="source" className="encryption-learn-more" data-chat-info-open aria-controls="chat-encryption-info">Learn more</Button></span>
          </div>
          <div className="dAbFpq">
            <div className="eJJEeC wa-typing-first">
              <div className="hFENyl">
                <div className="ixsrax" />
                <div className="dRvxoz" />
                <div className="kXBtNt" />
              </div>
            </div>
            <div className="kAZgZq wa-greeting">
              <div className="iSpIQi" id="greeting"><span data-chat-greeting>Hello, good morning!</span> <i className="fa-solid fa-sun wa-greeting-icon" aria-hidden="true" /></div>
            </div>
            <div className="eJJEeC wa-typing-second">
              <div className="hFENyl">
                <div className="ixsrax" />
                <div className="dRvxoz" />
                <div className="kXBtNt" />
              </div>
            </div>
            <div className="kAZgZq wa-follow-up">
              <div className="iSpIQi">How may I help you?</div>
            </div>
          </div>
        </div>
        <div className="blanter-msg">
          <textarea id="chat-input" maxLength={120} placeholder="Message" aria-label="Message" />
          <Button asChild variant="source" size="source"><a id="send-it" href="https://web.whatsapp.com/send?phone=+256750687790" target="_blank" rel="noopener noreferrer" aria-label="Send message on WhatsApp">
            <svg viewBox="0 0 448 448"><path d="M.213 32L0 181.333 320 224 0 266.667.213 416 448 224z" /></svg>
          </a></Button>
        </div>
      </div>
      <div id="get-number" />
      <Button variant="source" size="source" className="close-chat" aria-label="Close chat" data-chat-close>×</Button>
        <div id="chat-encryption-info" className="encryption-modal" role="dialog" aria-modal="true" aria-label="About end-to-end encryption" hidden>
          <Button variant="source" size="source" className="encryption-modal-close" aria-label="Close" data-chat-info-close>×</Button>
          <div className="encryption-modal-scroll">
            <svg className="encryption-illustration" viewBox="0 0 200 150" aria-hidden="true">
              <rect x="20" y="25" width="110" height="95" rx="12" fill="#25d366" stroke="#075e54" strokeWidth="4" />
              <rect x="30" y="35" width="90" height="75" rx="8" fill="#1eb85a" />
              <circle cx="75" cy="72" r="26" fill="#0b3d2e" />
              <circle cx="75" cy="72" r="20" fill="#25d366" />
              <circle cx="75" cy="72" r="7" fill="#0b3d2e" />
              <g stroke="#0b3d2e" strokeWidth="3">
                <line x1="75" y1="54" x2="75" y2="62" />
                <line x1="75" y1="82" x2="75" y2="90" />
                <line x1="57" y1="72" x2="65" y2="72" />
                <line x1="85" y1="72" x2="93" y2="72" />
              </g>
              <rect x="14" y="40" width="8" height="14" rx="3" fill="#075e54" />
              <rect x="14" y="90" width="8" height="14" rx="3" fill="#075e54" />
              <rect x="34" y="120" width="12" height="10" rx="2" fill="#075e54" />
              <rect x="104" y="120" width="12" height="10" rx="2" fill="#075e54" />
              <path d="M140 60 a22 22 0 0 1 44 0 v12 h-10 v-12 a12 12 0 0 0 -24 0 v12 h-10 z" fill="#f7e9d0" stroke="#075e54" strokeWidth="3" />
              <rect x="132" y="70" width="60" height="52" rx="10" fill="#f7e9d0" stroke="#075e54" strokeWidth="3" />
              <circle cx="162" cy="90" r="8" fill="#075e54" />
              <rect x="159" y="94" width="6" height="14" rx="3" fill="#075e54" />
            </svg>
            <h3>Your chats and calls are private</h3>
            <p>End-to-end encryption keeps your personal messages and calls between you and the people you choose. No one outside of the chat, not even WhatsApp, can read, listen to, or share them. This includes your:</p>
            <ul>
              <li><i className="fa-solid fa-message" aria-hidden="true" /> Text and voice messages</li>
              <li><i className="fa-solid fa-phone" aria-hidden="true" /> Audio and video calls</li>
              <li><i className="fa-solid fa-paperclip" aria-hidden="true" /> Photos, videos and documents</li>
              <li><i className="fa-solid fa-location-dot" aria-hidden="true" /> Location sharing</li>
              <li><i className="fa-solid fa-arrows-rotate" aria-hidden="true" /> Status updates</li>
            </ul>
            <a className="encryption-modal-link" href="https://www.whatsapp.com/security" target="_blank" rel="noopener noreferrer">Learn more</a>
          </div>
        </div>
    </div>
  </details>;
}
