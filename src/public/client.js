const initialStore = Immutable.Map({
  info: Immutable.Map({}),
  photos: Immutable.List([]),
  rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
  selectedRover: '',
})

// add our markup to the page
const root = document.getElementById('root')

const setBackground = () => {
  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => {
      console.log('succ')
      document.body.style.backgroundImage = "url('" + apod.url + "')"
    })
}

const updateStore = (store, newState) => {
  render(root, store.merge(newState))
}

const getRoverInformation = (state, rover) => {
  fetch(`http://localhost:3000/manifests?rover=${rover}`)
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
    <ul class="information">
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

const getRoverPhotos = (state, rover) => {
  fetch(`http://localhost:3000/photos/?rover=${rover}`)
    .then((res) => res.json())
    .then(({ photos }) => {
      updateStore(state, { photos: Immutable.List(photos) })
    })
}

const RoverPhotos = (state) => {
  const photos = state.get('photos')
  const rover = state.get('selectedRover')

  if (
    (rover !== '' && photos.isEmpty()) ||
    (rover !== '' && rover !== photos.get(0).rover.name)
  ) {
    getRoverPhotos(state, rover)
  }

  if (!photos.isEmpty()) {
    return `
      <img src="${photos.get(0).img_src}" />
    `
  }

  return ''
}

const render = async (root, state) => {
  root.innerHTML = App(state)
  addButtonEventListeners(state)
}

// create content
const App = (state) => {
  const { rovers, selectedRover } = state.toJS()

  return `
        <header>
          <div class="menu">
            <button id="${rovers[0]}">${rovers[0]}</button>
            <button id="${rovers[1]}">${rovers[1]}</button>
            <button id="${rovers[2]}">${rovers[2]}</button>
          </div>
        </header>
        <main>
            <section class="content">
                <h1 class="title">${selectedRover}</h3>
                ${RoverInformation(state)}
                ${RoverPhotos(state)}
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
