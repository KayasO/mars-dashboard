const initialStore = Immutable.Map({
  info: Immutable.Map({}),
  photos: Immutable.List([]),
  rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
  selectedRover: '',
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
  render(root, store.merge(newState))
}

const getRoverInformation = (state, rover) => {
  fetch(`http://localhost:3000/manifests/${rover}`)
    .then((res) => res.json())
    .then((info) => {
      updateStore(state, { info: Immutable.Map(info) })
    })
}

const RoverInformation = (state) => {
  const info = state.get('info')
  const rover = state.get('selectedRover')

  if (
    (rover !== '' && info.isEmpty()) ||
    (rover !== '' && rover !== info.get('name'))
  ) {
    getRoverInformation(state, rover)
  }

  if (rover !== '' && !info.isEmpty()) {
    return `
    <ul>
      <li><b>Status:</b> ${info.get('status')}</li>
      <li><b>Launch date:</b> ${info.get('launch_date')}</li>
      <li><b>Landing date:</b> ${info.get('landing_date')}</li>
      <li><b>Last taken photos from:</b> ${info.get('recent_photos_date')}</li>
      <li><b>Amount:</b> ${info.get('recent_photos_amount')}</li>
    </ul>
  `
  }

  return ''
}

const getCuriosityPhotos = (state) => {
  fetch(`http://localhost:3000/photos/curiosity?date=2021-12-12`)
    .then((res) => res.json())
    .then(({ photos }) => {
      updateStore(state, { photos: Immutable.List(photos) })
    })
}

const CuriosityPhotos = (state) => {
  const photos = state.get('photos')
  if (photos.isEmpty()) {
    getCuriosityPhotos(state)
    return ''
  } else {
    return `
      <img src="${photos.get(0).img_src}" height="350px" width="100%" />
      <p>${photos.get(0).id}</p>
    `
  }
}

const render = async (root, state) => {
  root.innerHTML = App(state)
  addButtonEventListeners(state)
}

// create content
const App = (state) => {
  const { rovers } = state.toJS()
  console.log('state: ', state)

  return `
        <header></header>
        <main>
            <div class="menu">
              <button id="${rovers[0]}">${rovers[0]}</button>
              <button id="${rovers[1]}">${rovers[1]}</button>
              <button id="${rovers[2]}">${rovers[2]}</button>
            </div>
            <section>
                <h1>${rovers[0]}!</h3>
                ${RoverInformation(state)}
                ${CuriosityPhotos(state)}
            </section>
        </main>
        <footer></footer>
    `
}

const addButtonEventListeners = (state) => {
  const { rovers } = state.toJS()

  rovers.forEach((rover) => {
    document.getElementById(rover).addEventListener('click', () => {
      updateStore(state, { selectedRover: rover })
    })
  })
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, initialStore)
})
