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

// ------------------------------------------------------  EXAMPLES

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `
  }

  return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (state, apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date()
  const photodate = new Date(apod.date)

  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(state)
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === 'video') {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `
  } else {
    return `
            <img src="${apod.url}" height="350px" width="100%" />
            <p>${apod.explanation}</p>
        `
  }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(state, { apod }))
}
