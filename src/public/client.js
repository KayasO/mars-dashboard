const initialStore = Immutable.Map({
  user: Immutable.Map({ name: 'Student' }),
  apod: '',
  info: Immutable.Map({}),
  rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
  render(root, store.merge(newState))
}

const getCuriosityInformation = (state) => {
  fetch(`http://localhost:3000/manifests/curiosity`)
    .then((res) => res.json())
    .then((info) => {
      updateStore(state, { info: Immutable.Map(info) })
    })
}

const CuriosityInformation = (state) => {
  const info = state.get('info')

  if (info.isEmpty()) {
    getCuriosityInformation(state)
    return ''
  } else {
    return `
      <ul>
        <li><b>Status:</b> ${info.get('status')}</li>
        <li><b>Launch date:</b> ${info.get('launch_date')}</li>
        <li><b>Landing date:</b> ${info.get('landing_date')}</li>
        <li><b>Last taken photos from:</b> ${info.get(
          'recent_photos_date'
        )}</li>
        <li><b>Amount:</b> ${info.get('recent_photos_amount')}</li>
      </ul>
    `
  }
}

const render = async (root, state) => {
  root.innerHTML = App(state)
}

// create content
const App = (state) => {
  const { rovers } = state.toJS()
  console.log('state: ', state)

  return `
        <header></header>
        <main>
            <section>
                <h1>${rovers[0]}!</h3>
                ${CuriosityInformation(state)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, initialStore)
})
