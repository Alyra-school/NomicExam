import { useEffect, useMemo, useState } from 'react';
import './App.css';

const ACCESS_KEY = 'nomic_exam_unlocked_ids';
const ADMIN_HASH = 'cc4831395437a9713314ff9286592b1013cc3822e2c98d041b421c1d8a686504';
const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwjjvlfxFY-cEnVXlw0KBZCwZJvUYBZX99T7kwWHozfQ2EKFiA4TMxFTWxliJZo9c2H/exec';
const SHEET_QCM = 'QCM';
const SHEET_DAY1_EX1 = 'Day1-Ex1';
const SHEET_DAY1_EX2 = 'Day1-Ex2';

const QCM_QUESTIONS = [
  {
    id: 'q1',
    text: 'What is the main difference between a Layer 1 chain and a rollup?',
    options: [
      'Rollups execute off-chain and post proofs on L1',
      'L1 chains only store data',
      'Rollups are always permissioned',
      'L1 cannot run smart contracts',
    ],
  },
  {
    id: 'q2',
    text: 'EOA stands for:',
    options: [
      'Externally Owned Account',
      'Ethereum Oracle Agent',
      'External Operator Address',
      'Embedded On-chain Account',
    ],
  },
  {
    id: 'q3',
    text: 'Which entity can initiate a transaction without code execution?',
    options: ['Smart contract', 'EOA', 'Validator', 'Light client'],
  },
  {
    id: 'q4',
    text: 'What is a common vulnerability in smart contracts?',
    options: ['Re-entrancy', 'TLS downgrade', 'SQL injection', 'CSRF'],
  },
  {
    id: 'q5',
    text: 'In EVM, gas is primarily used to:',
    options: [
      'Limit computation and prevent abuse',
      'Encrypt storage',
      'Prove identity',
      'Compress blocks',
    ],
  },
  {
    id: 'q6',
    text: 'What is a key property of a Merkle tree in blockchains?',
    options: [
      'Efficient inclusion proofs',
      'Constant block time',
      'Unlimited throughput',
      'Private transactions by default',
    ],
  },
  {
    id: 'q7',
    text: 'In a rollup, the data availability problem concerns:',
    options: [
      'Ensuring transaction data is accessible to all',
      'Preventing double spending',
      'Increasing block size only',
      'Validating signatures',
    ],
  },
  {
    id: 'q8',
    text: 'What does a smart contract\'s "immutable" bytecode imply?',
    options: [
      'It cannot be changed once deployed',
      'It can be upgraded without proxy',
      'It is encrypted',
      'It requires admin approval to run',
    ],
  },
  {
    id: 'q9',
    text: 'Which statement about consensus is correct?',
    options: [
      'It allows nodes to agree on a single history',
      'It prevents any forks ever',
      'It eliminates the need for cryptography',
      'It guarantees zero fees',
    ],
  },
  {
    id: 'q10',
    text: 'What is the purpose of a nonce in a transaction?',
    options: [
      'Prevent replay and order transactions',
      'Store contract code',
      'Pay network fees',
      'Verify the validator set',
    ],
  },
  {
    id: 'q11',
    text: 'What is a proxy pattern used for?',
    options: ['Upgradability', 'Faster mining', 'Randomness', 'Gas refund'],
  },
  {
    id: 'q12',
    text: 'Which is true about an oracle?',
    options: [
      'It brings off-chain data on-chain',
      'It creates blocks',
      'It replaces validators',
      'It encrypts private keys',
    ],
  },
  {
    id: 'q13',
    text: 'In Solidity, why use checks-effects-interactions?',
    options: [
      'To reduce re-entrancy risk',
      'To compress logs',
      'To save storage',
      'To upgrade automatically',
    ],
  },
  {
    id: 'q14',
    text: 'What does "finality" mean in a blockchain context?',
    options: [
      'A block is highly unlikely to be reverted',
      'The block is encrypted forever',
      'The chain is private',
      'Validators are fixed',
    ],
  },
  {
    id: 'q15',
    text: 'What is the main difference between PoW and PoS?',
    options: [
      'PoW uses computation, PoS uses stake',
      'PoS has no validators',
      'PoW has instant finality',
      'PoS cannot be decentralized',
    ],
  },
  {
    id: 'q16',
    text: 'What is a common goal of L2 solutions?',
    options: [
      'Increase throughput and reduce fees',
      'Replace cryptography',
      'Remove smart contracts',
      'Require KYC',
    ],
  },
  {
    id: 'q17',
    text: 'Which attack targets contract logic by calling it repeatedly?',
    options: ['Re-entrancy', 'Phishing', 'DNS spoofing', 'Cache poisoning'],
  },
  {
    id: 'q18',
    text: 'Why are events useful in Ethereum?',
    options: [
      'They enable efficient off-chain indexing',
      'They store state',
      'They reduce gas to zero',
      'They verify signatures',
    ],
  },
  {
    id: 'q19',
    text: 'What is the role of a governance token?',
    options: [
      'Voting on protocol changes',
      'Paying all gas fees',
      'Encrypting storage',
      'Generating private keys',
    ],
  },
  {
    id: 'q20',
    text: 'What is the primary benefit of formal verification?',
    options: [
      'Proving properties about contract behavior',
      'Increasing block time',
      'Replacing audits',
      'Eliminating all bugs',
    ],
  },
];

const DAY1_EX1_QUESTIONS = [
  'What problem was EIP-1559 designed to solve in the Ethereum fee market?',
  'How does the introduction of a base fee change the user experience for setting transaction fees?',
  'What is the role of the fee "burn" in EIP-1559, and why does it matter economically?',
  'Explain how the base fee is adjusted from block to block and what target block utilization means.',
  'What happens if a block exceeds the target gas usage, and how is the base fee updated in that case?',
];

const PAGES = [
  { id: 'home', label: 'Home' },
  { id: 'day1', label: 'Day 1' },
  { id: 'day2', label: 'Day 2' },
  { id: 'day3', label: 'Day 3' },
];

const EXERCISES = [
  {
    id: 'day1-ex1',
    day: 'day1',
    label: 'Day 1 · Exercise 1',
    title: 'Reading & Questions (EIP)',
    codeHash: '3489b0e55cc164408e39df3f04009414c4da161a6e728656b92e3df7e640c399',
    content: (
      <Day1Ex1Form />
    ),
  },
  {
    id: 'day1-ex2',
    day: 'day1',
    label: 'Day 1 · Exercise 2',
    title: 'Written Expression (Social Media Update)',
    codeHash: 'c68be591024b06b25a7c6b80f77beb511fd7993a1b137e3c2c04ae6cf9c688e8',
    content: (
      <Day1Ex2Form />
    ),
  },
  {
    id: 'day1-ex3',
    day: 'day1',
    label: 'Day 1 · Exercise 3',
    title: 'Oral Expression (Simple Technical Questions)',
    codeHash: 'c2f5cba27c5b48d10ef910823d703900b5071b8954246e771270ea5ba291314e',
    content: (
      <>
        <p>Task: answer orally, in English, the following questions:</p>
        <ol className="numbered">
          <li>What is a blockchain, in one or two sentences?</li>
          <li>What is the difference between a node and a validator?</li>
          <li>Why do smart contracts need gas or fees to run?</li>
          <li>What is the purpose of a block explorer?</li>
          <li>Can you name one common risk in smart contract development?</li>
          <li>What is the difference between a public and a private blockchain?</li>
        </ol>
      </>
    ),
  },
  {
    id: 'day2-ex1',
    day: 'day2',
    label: 'Day 2 · Exercise 1',
    title: 'MCQ (20 questions, EN)',
    codeHash: '0ece54f8e1e742864f0eb05edf32b7addd76510c77e84b3830d847db38d7554a',
    content: (
      <QcmForm />
    ),
  },
  {
    id: 'day2-ex2',
    day: 'day2',
    label: 'Day 2 · Exercise 2',
    title: 'Case Study (EN)',
    codeHash: 'de396c7037d78f3537eb0d4278bb7840b6c5f2bf8e257f9c8d269e95a774e05f',
    content: (
      <>
        <p>
          Case: A team wants to build a DApp for peer-to-peer carbon credit trading. The DApp must support
          onboarding, wallet connection, listing credits, settlement, and a simple dispute process.
        </p>
        <p>Task: Present a clear process to create this DApp. Your response should include:</p>
        <ul className="flat-list">
          <li>Architecture overview (front-end, smart contracts, indexer, storage).</li>
          <li>Key smart contracts and their responsibilities.</li>
          <li>Security and compliance considerations.</li>
          <li>Deployment and monitoring steps.</li>
          <li>Testing strategy (unit, integration, audit).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'day3-ex1',
    day: 'day3',
    label: 'Day 3 · Exercise 1',
    title: 'Smart Contract Reading',
    codeHash: '16fba722fa657b8d8c8e705fe062c0183ef9cbb2c3b3cd178dbc3de1394d06fb',
    content: (
      <>
        <p>
          Selected protocol: Uniswap V2. GitHub link:
          <span className="mono"> https://github.com/Uniswap/v2-core</span>
        </p>
        <p>Task: read the <span className="mono">UniswapV2Pair.sol</span> contract and answer:</p>
        <ol className="numbered">
          <li>What is the role of the <span className="mono">reserve0</span> and <span className="mono">reserve1</span> variables?</li>
          <li>How does the contract compute fees during a swap?</li>
          <li>What is the <span className="mono">mint</span> function for and when is it called?</li>
          <li>Explain the reserve synchronization mechanism.</li>
          <li>What is the purpose of the <span className="mono">Swap</span> event?</li>
        </ol>
      </>
    ),
  },
  {
    id: 'day3-ex2',
    day: 'day3',
    label: 'Day 3 · Exercise 2',
    title: 'Development (Solidity, Governance)',
    codeHash: '2219ffd527d11b998c2c086402abda02dfa9d54fa5911501bf222ca27bc809c7',
    content: (
      <>
        <p>
          Design a governance contract in Solidity using OpenZeppelin libraries. The goal is to allow
          token holders to vote on proposals.
        </p>
        <p>Requirements:</p>
        <ul className="flat-list">
          <li>Use <span className="mono">ERC20Votes</span> for the governance token.</li>
          <li>Use <span className="mono">Governor</span> + modules (quorum, timelock).</li>
          <li>Define a proposal lifecycle (creation, voting, execution).</li>
          <li>Specify key parameters (quorum %, voting delay, voting period).</li>
          <li>Include an example proposal (e.g., change a parameter).</li>
        </ul>
        <p className="muted">Deliverable: commented code + short explanation of choices.</p>
      </>
    ),
  },
];

function useHashRoute() {
  const getRoute = () => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  };

  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return [route, (next) => {
    window.location.hash = next;
  }];
}

function useUnlocks() {
  const [unlockedIds, setUnlockedIds] = useState(() => {
    const raw = localStorage.getItem(ACCESS_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const update = (nextIds) => {
    const unique = Array.from(new Set(nextIds));
    localStorage.setItem(ACCESS_KEY, JSON.stringify(unique));
    setUnlockedIds(unique);
  };

  return [unlockedIds, update];
}

async function sha256(value) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sendToSheet(payload) {
  await fetch(SHEET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    mode: 'no-cors',
  });
}

function Day1Ex1Form() {
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState(() => DAY1_EX1_QUESTIONS.map(() => ''));
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const onChangeAnswer = (index, value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setStatus('Please enter your first name.');
      return;
    }
    if (answers.some((value) => !value.trim())) {
      setStatus('Please answer all questions.');
      return;
    }
    setSending(true);
    setStatus('');
    try {
      await sendToSheet({
        sheetName: SHEET_DAY1_EX1,
        name: name.trim(),
        answers,
        submittedAt: new Date().toISOString(),
      });
      setStatus('Thanks, your answers have been sent.');
    } catch (error) {
      setStatus('Error while sending. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="long-form" onSubmit={onSubmit}>
      <p className="muted">Selected documentation: EIP-1559 (Ethereum fee market change).</p>
      <p>Task: read the official EIP-1559 documentation in English, then answer the questions.</p>
      <label className="field">
        First name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your first name"
          required
        />
      </label>
      <ol className="numbered">
        {DAY1_EX1_QUESTIONS.map((question, index) => (
          <li key={question}>
            <p className="qcm-question">{question}</p>
            <textarea
              rows={4}
              value={answers[index]}
              onChange={(event) => onChangeAnswer(index, event.target.value)}
              placeholder="Your answer"
              required
            />
          </li>
        ))}
      </ol>
      <button className="btn" type="submit" disabled={sending}>
        {sending ? 'Sending...' : 'Submit Exercise 1'}
      </button>
      <p className="muted">{status}</p>
    </form>
  );
}

function Day1Ex2Form() {
  const [name, setName] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setStatus('Please enter your first name.');
      return;
    }
    if (!answer.trim()) {
      setStatus('Please write your response.');
      return;
    }
    setSending(true);
    setStatus('');
    try {
      await sendToSheet({
        sheetName: SHEET_DAY1_EX2,
        name: name.trim(),
        answer,
        submittedAt: new Date().toISOString(),
      });
      setStatus('Thanks, your answer has been sent.');
    } catch (error) {
      setStatus('Error while sending. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="long-form" onSubmit={onSubmit}>
      <p>
        Task (EN): Write a short social media announcement (120–160 words) about a new update of a
        migration tool between Tezos and Etherlink. The audience is technical but busy. Include:
      </p>
      <ul className="flat-list">
        <li>What changed in the update.</li>
        <li>Why it is useful for teams moving assets or contracts.</li>
        <li>A short call-to-action.</li>
      </ul>
      <label className="field">
        First name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your first name"
          required
        />
      </label>
      <label className="field">
        Response
        <textarea
          rows={10}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Write your announcement here"
          required
        />
      </label>
      <button className="btn" type="submit" disabled={sending}>
        {sending ? 'Sending...' : 'Submit Exercise 2'}
      </button>
      <p className="muted">{status}</p>
    </form>
  );
}

function QcmForm() {
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState(() => ({}));
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const onAnswerChange = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex + 1 }));
  };

  const isComplete = QCM_QUESTIONS.every((q) => answers[q.id]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setStatus('Please enter your first name.');
      return;
    }
    if (!isComplete) {
      setStatus('Please answer all questions.');
      return;
    }
    if (SHEET_ENDPOINT === 'PASTE_YOUR_APPS_SCRIPT_URL') {
      setStatus('Google Sheet endpoint missing. Add it in the code.');
      return;
    }

    setSending(true);
    setStatus('');
    try {
      await sendToSheet({
        sheetName: SHEET_QCM,
        name: name.trim(),
        answers: QCM_QUESTIONS.map((q) => answers[q.id]),
        submittedAt: new Date().toISOString(),
      });
      setStatus('Thanks, your answers have been sent.');
    } catch (error) {
      setStatus('Error while sending. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="qcm-form" onSubmit={onSubmit}>
      <p>Choose the single correct answer for each question.</p>
      <label className="field">
        First name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your first name"
          required
        />
      </label>
      <ol className="numbered qcm-list">
        {QCM_QUESTIONS.map((question, index) => (
          <li key={question.id}>
            <p className="qcm-question">{index + 1}. {question.text}</p>
            <div className="qcm-options">
              {question.options.map((option, optionIndex) => (
                <label key={option} className="qcm-option">
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === optionIndex + 1}
                    onChange={() => onAnswerChange(question.id, optionIndex)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button className="btn" type="submit" disabled={sending}>
        {sending ? 'Sending...' : 'Submit the MCQ'}
      </button>
      <p className="muted">{status}</p>
    </form>
  );
}

function Header({ route }) {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="logo-pair">
          <img src="/nomadic.png" alt="Nomadic" />
          <img src="/alyra.png" alt="Alyra" />
        </div>
      </div>
      <div className="header-title">
        <h1>Employee assessment</h1>
        <p className="subtitle">3-day blockchain assessments</p>
      </div>
      <nav className="nav">
        {PAGES.map((page) => (
          <a
            key={page.id}
            href={`#${page.id}`}
            aria-current={route === page.id ? 'page' : undefined}
          >
            {page.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function LockedOverlay() {
  return (
    <div className="lock-overlay" aria-hidden="true">
      <div>
        <h3>Exercises locked</h3>
        <p>Unlock with a code.</p>
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, unlocked, onUnlock }) {
  const [codeInput, setCodeInput] = useState('');
  const [message, setMessage] = useState('');

  const handleUnlock = async (event) => {
    event.preventDefault();
    const trimmed = codeInput.trim().toUpperCase();
    if (!trimmed) {
      setMessage('Enter a code.');
      return;
    }
    const hash = await sha256(trimmed);
    if (hash === exercise.codeHash || hash === ADMIN_HASH) {
      onUnlock(exercise.id);
      setMessage('Exercise unlocked.');
      setCodeInput('');
      return;
    }
    setMessage('Incorrect code.');
  };

  return (
    <div className={`card ${unlocked ? '' : 'locked-card'}`}>
      <h3>{exercise.label}</h3>
      <p>{exercise.title}</p>
      <p className="muted">Status: {unlocked ? 'Unlocked' : 'Locked'}</p>
      {unlocked ? (
        <a className="btn ghost small" href={`#${exercise.id}`}>Open</a>
      ) : (
        <form className="unlock-form inline" onSubmit={handleUnlock}>
          <label className="sr-only" htmlFor={`${exercise.id}-code`}>Code</label>
          <input
            id={`${exercise.id}-code`}
            type="text"
            value={codeInput}
            onChange={(event) => setCodeInput(event.target.value)}
            placeholder="Exercise or admin code"
            required
          />
          <button className="btn small" type="submit">Unlock</button>
        </form>
      )}
      {!unlocked && <div className="message" role="status">{message}</div>}
    </div>
  );
}

function Home() {
  return (
    <main className="container">
      <section className="hero">
        <div>
          <h2>Employee assessment</h2>
          <p>
            Each day contains multiple exercises. Access is protected and unlocked with a simple code.
          </p>
          <div className="cta-row">
            <a className="btn" href="#day1">Start Day 1</a>
          </div>
        </div>
        <div className="hero-card">
          <h3>Format</h3>
          <ul className="flat-list">
            <li>Day 1: English + communication</li>
            <li>Day 2: Technical MCQ + case study</li>
            <li>Day 3: Smart contract reading + dev</li>
          </ul>
          <p className="muted">All detailed instructions are on the dedicated pages.</p>
        </div>
      </section>

      <section className="grid">
        <a className="card" href="#day1">
          <h3>Day 1</h3>
          <p>English assessment applied to blockchain.</p>
        </a>
        <a className="card" href="#day2">
          <h3>Day 2</h3>
          <p>Technical MCQ + DApp case study.</p>
        </a>
        <a className="card" href="#day3">
          <h3>Day 3</h3>
          <p>Smart contract reading and development.</p>
        </a>
      </section>
    </main>
  );
}

function DayOverview({ day, title, description, imageSrc, unlockedIds, onUnlock }) {
  const dayExercises = EXERCISES.filter((exercise) => exercise.day === day);
  return (
    <main className="container">
      <section className="notice">
        <h2>{title}</h2>
        <p>{description}</p>
        {imageSrc && (
          <div className="day-image">
            <img src={imageSrc} alt={`${title} visual`} />
          </div>
        )}
      </section>
      <section className="grid">
        {dayExercises.map((exercise) => {
          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              unlocked={unlockedIds.includes(exercise.id)}
              onUnlock={onUnlock}
            />
          );
        })}
      </section>
    </main>
  );
}

function ExercisePage({ exercise, unlocked, onUnlock }) {
  return (
    <main className="container">
      <section className="notice">
        <h2>{exercise.label}</h2>
        <p>{exercise.title}</p>
      </section>

      <section className={`exercise ${unlocked ? '' : 'locked'}`}>
        {!unlocked && <LockedOverlay />}
        {unlocked && (
          <article className="exercise-block">
            {exercise.content}
          </article>
        )}
        {!unlocked && (
          <article className="exercise-block">
            <p className="muted">This exercise is not unlocked yet.</p>
            <p className="muted">Go back to the day page to enter the code.</p>
          </article>
        )}
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>Nomadic x Alyra Employee assessment / All rights reserved @ Alyra 2026</p>
    </footer>
  );
}

function App() {
  const [route] = useHashRoute();
  const [unlockedIds, setUnlockedIds] = useUnlocks();

  const content = useMemo(() => {
    if (route.startsWith('day')) {
      const exercise = EXERCISES.find((item) => item.id === route);
      if (exercise) {
        const unlocked = unlockedIds.includes(exercise.id);
        return (
          <ExercisePage
            exercise={exercise}
            unlocked={unlocked}
            onUnlock={(id) => {
              if (!unlockedIds.includes(id)) {
                setUnlockedIds([...unlockedIds, id]);
              }
            }}
          />
        );
      }
      if (route === 'day1') {
        return (
          <DayOverview
            day="day1"
            title="Day 1"
            description="English assessment applied to blockchain."
            imageSrc="/nomadic1.png"
            unlockedIds={unlockedIds}
            onUnlock={(id) => {
              if (!unlockedIds.includes(id)) {
                setUnlockedIds([...unlockedIds, id]);
              }
            }}
          />
        );
      }
      if (route === 'day2') {
        return (
          <DayOverview
            day="day2"
            title="Day 2"
            description="Technical MCQ and DApp case study."
            imageSrc="/nomadic2.png"
            unlockedIds={unlockedIds}
            onUnlock={(id) => {
              if (!unlockedIds.includes(id)) {
                setUnlockedIds([...unlockedIds, id]);
              }
            }}
          />
        );
      }
      if (route === 'day3') {
        return (
          <DayOverview
            day="day3"
            title="Day 3"
            description="Smart contract reading and development."
            imageSrc="/nomadic3.png"
            unlockedIds={unlockedIds}
            onUnlock={(id) => {
              if (!unlockedIds.includes(id)) {
                setUnlockedIds([...unlockedIds, id]);
              }
            }}
          />
        );
      }
    }

    switch (route) {
      case 'home':
      default:
        return <Home />;
    }
  }, [route, unlockedIds, setUnlockedIds]);

  return (
    <div className="app">
      <Header route={route} />
      {content}
      <Footer />
    </div>
  );
}

export default App;
