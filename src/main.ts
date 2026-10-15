import './style.css'

const params = new URLSearchParams(window.location.search)
const bossName = clean(params.get('to')) ?? 'Amanda'
const senderName = clean(params.get('from')) ?? 'Your Totally Normal Employee'

function clean(value: string | null): string | null {
  const trimmed = value?.trim().slice(0, 40)
  return trimmed ? trimmed : null
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`)
}

const memeSrc = `${import.meta.env.BASE_URL}amanda-fan.png`
const boss = escapeHtml(bossName)
const sender = escapeHtml(senderName)

const normalThings = [
  `Check Slack to see if your little green dot is on. <span class="aside">(It's been on since 8:47. Not that I noticed.)</span>`,
  `Save every "great job!" you've sent me in a folder named <em>Evidence</em>. <span class="aside">(Backed up in three places.)</span>`,
  `Spend 40 minutes analyzing the exclamation point in your "Sounds good!"`,
  `Rehearse my status updates in the mirror. Then rehearse my reaction to your feedback.`,
  `Get a little emotional when you're out of office. <span class="aside">(Your auto-reply and I have gotten close.)</span>`,
]

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="backdrop" aria-hidden="true"></div>
  <main class="stage">
    <section class="card cover" id="cover" aria-labelledby="cover-title">
      <p class="eyebrow">October 16 &middot; Boss's Day</p>
      <figure class="polaroid">
        <div class="photo-wrap">
          <img src="${memeSrc}" alt="The wide-eyed 'Overly Attached Girlfriend' meme, smiling intensely at the camera" id="meme" />
          <div class="photo-fallback" hidden>(imagine me, smiling at you, very normally)</div>
        </div>
        <figcaption>me, thinking about your leadership</figcaption>
      </figure>
      <h1 id="cover-title">Happy Boss's Day, <span class="name">${boss}</span>!</h1>
      <p class="lede">I made you a card. Just a small one. A totally normal amount of effort.</p>
      <button class="btn primary" id="open-btn" type="button">Open your card</button>
    </section>

    <section class="card inside" id="inside" aria-labelledby="inside-title" hidden>
      <div class="inside-grid">
        <aside class="inside-photo">
          <figure class="polaroid tilt">
            <div class="photo-wrap small">
              <img src="${memeSrc}" alt="" />
            </div>
            <figcaption>reading your last email again</figcaption>
          </figure>
          <div class="ticker" role="status" aria-live="polite">
            <span class="ticker-label">Times I've said "${boss} would know" this week</span>
            <span class="ticker-value" id="ticker">0</span>
          </div>
        </aside>

        <div class="letter">
          <h2 id="inside-title">Dear ${boss},</h2>
          <p>
            I just wanted to say <strong>thank you</strong> for being my leader. Not in a weird way.
            In a completely normal, healthy, professional way.
          </p>
          <p>
            Your guidance means so much to me. I wrote down everything you said in our last 1:1.
            And the one before that. I have a binder. It's color-coded. That's just good note-taking.
          </p>

          <h3>Totally normal things I definitely don't do</h3>
          <ul class="normal-list">
            ${normalThings.map((item) => `<li>${item}</li>`).join('')}
          </ul>

          <div class="question" id="question">
            <p class="question-text">So, will you keep being my boss forever?</p>
            <div class="question-actions">
              <button class="btn primary" type="button" data-answer>Yes</button>
              <button class="btn ghost" type="button" data-answer>Absolutely yes</button>
            </div>
            <p class="answer" id="answer" hidden>
              I knew you'd say that. I'm so glad. I'm being very normal about this.
            </p>
          </div>

          <p class="signoff">With a regular, appropriate amount of appreciation,</p>
          <p class="signature">${sender}</p>
          <p class="ps">P.S. I'll be right here waiting for your reply. No pressure. I'm just here. Waiting.</p>

          <p class="sincere">
            But honestly, thanks for your leadership over the past year. I know working here poses
            its certain challenges, and I've seen you seemingly navigate them with relative ease over
            the years. And I can only imagine jumping from an IC to a Sr Manager, and dealing with
            previously existing colleagues, must've been difficult at times. Happy we can continue to
            work together, and it's refreshing to actually see that "get shit done" isn't just some
            buzzword for the first time that I've seen in over 4.5 years.
          </p>

          <div class="footer-actions">
            <button class="btn ghost" id="close-btn" type="button">Close card</button>
            <button class="btn ghost" id="share-btn" type="button">Copy link</button>
          </div>
        </div>
      </div>
    </section>
  </main>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
`

const cover = document.querySelector<HTMLElement>('#cover')!
const inside = document.querySelector<HTMLElement>('#inside')!
const toast = document.querySelector<HTMLElement>('#toast')!
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const meme = document.querySelector<HTMLImageElement>('#meme')!
meme.addEventListener('error', () => {
  meme.hidden = true
  meme.parentElement!.querySelector<HTMLElement>('.photo-fallback')!.hidden = false
})
document.querySelectorAll<HTMLImageElement>('.inside-photo img').forEach((img) => {
  img.addEventListener('error', () => img.closest('figure')?.remove())
})

let tickerTimer: number | undefined

function startTicker() {
  const el = document.querySelector<HTMLElement>('#ticker')!
  let count = 0
  const target = 47
  window.clearTimeout(tickerTimer)
  const tick = () => {
    count += 1
    el.textContent = count.toLocaleString()
    if (count >= target) el.parentElement!.classList.add('bump')
    tickerTimer = window.setTimeout(tick, count < target ? 45 : 2500 + Math.random() * 3000)
  }
  tick()
}

function show(next: HTMLElement, prev: HTMLElement) {
  prev.classList.add('leaving')
  window.setTimeout(
    () => {
      prev.hidden = true
      prev.classList.remove('leaving')
      next.hidden = false
      next.classList.add('entering')
      next.addEventListener('animationend', () => next.classList.remove('entering'), { once: true })
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    },
    reduceMotion ? 0 : 280,
  )
}

document.querySelector('#open-btn')!.addEventListener('click', () => {
  show(inside, cover)
  burst(24)
  startTicker()
})

document.querySelector('#close-btn')!.addEventListener('click', () => {
  window.clearTimeout(tickerTimer)
  show(cover, inside)
  showToast("Closing the card. I'll still be thinking about it, though.")
})

document.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelector<HTMLElement>('#answer')!.hidden = false
    document.querySelector('#question')!.classList.add('answered')
    burst(60)
  })
})

document.querySelector('#share-btn')!.addEventListener('click', async () => {
  const url = new URL(window.location.href)
  url.searchParams.set('to', bossName)
  if (senderName !== 'Your Totally Normal Employee') url.searchParams.set('from', senderName)
  try {
    await navigator.clipboard.writeText(url.toString())
    showToast('Link copied. Send it. Send it now.')
  } catch {
    showToast(`Couldn't copy automatically. Here's the link: ${url.toString()}`)
  }
})

let toastTimer: number | undefined
function showToast(message: string) {
  toast.textContent = message
  toast.classList.add('visible')
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3200)
}

function burst(count: number) {
  if (reduceMotion) return
  const colors = ['#ff4d6d', '#ff8fa3', '#ffb3c1', '#c9184a', '#ffd166']
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span')
    heart.className = 'heart'
    heart.style.left = `${Math.random() * 100}vw`
    heart.style.setProperty('--size', `${10 + Math.random() * 18}px`)
    heart.style.setProperty('--color', colors[i % colors.length])
    heart.style.setProperty('--drift', `${(Math.random() - 0.5) * 160}px`)
    heart.style.animationDuration = `${2.2 + Math.random() * 1.8}s`
    heart.style.animationDelay = `${Math.random() * 0.4}s`
    heart.addEventListener('animationend', () => heart.remove())
    document.body.appendChild(heart)
  }
}
