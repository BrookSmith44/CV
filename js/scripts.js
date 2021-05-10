// Get elements
// Get toggle menu element
const menu = document.getElementById('toggleMenu');
// Get chevrons by class name
const scrollChevrons = document.getElementsByClassName('scroll');
// Get canvas element
const canvas = document.getElementById('canvas');
const home = document.getElementById('home');

// Create array of colours for header
const colours = ['seagreen', '#002b36', '#553D67', '#501B1D'];

// Variable for pause set to false initally
let pause = false;

// Variable for non-start when browser is too small
let nonStart = false;

// Instantiate image source class for animated backgroud
// Instantiate new Image
const png = new Image();
const imageSrc = new ImageSrc();
png.src = imageSrc.src;

// Event listeners
const contact = document.getElementById('contact-me');

// Get contact form
const contactForm = document.forms['contact-form'];

// Event listener for when user clicks on contact me button
contact.addEventListener('click', function() {
  // Open modal with contact form
  openModal(contact.id, 'Contact Me');
});

timelineModal();

contactForm.addEventListener('submit', function(event) {
  event.preventDefault();
  openEmail(contactForm);
});

// Event listener to listen for click of toggle menu
menu.addEventListener('click', toggleMenu);

// Event listener to listen for when user clicks up arrow
scrollChevrons[0].addEventListener('click', function() {
  scroll('up');
});

// Event listener to listen for when user clicks down arrow
scrollChevrons[1].addEventListener('click', function() {
  scroll('down');
});

// Event lister to listen for when user scrolls
window.addEventListener('scroll', function() {
  // Call function to check whether user is at top or bottom of site
  // Display chevrons to control scrolling accordingly
  displayChevrons();

  // Change header colour
  headerColour();

  // Trigger slide in animation if content is in view
  slideInAboutContent();
});

// Event listener to listen for when user presses up key
window.addEventListener('keyup', function (event) {
  // Check to see if up key was pressed
  if (event.keyCode === 38) {
    scroll('up');
  } else if (event.keyCode === 40) {
    scroll('down');
  }
});

// add event listener to run when page has been fully loaded
window.addEventListener('load', (event) => {
  // Display arrows based on where user is on the page
  displayChevrons();

  // Set header colour
  headerColour();

  // Event hover effect on all the links
  hoverTextColour();

  // Trigger slide in animation if content is in view
  slideInAboutContent();

  displayContent();

  if(!inView(home)) {
    pause = true;
  }

  // Check if window size is bigger than 400px
  if (window.innerWidth > 400) {
    // Draw background on canvas to be animated
    drawBackground();

    // Animate
    createBackgroundAnimation();
  } else {
    // Set value to indicate animation has been not run because of size
    nonStart = true;
  }
});

// Event to listen to when the browser is resized
window.addEventListener('resize', function() {
  // Check if animation has not started and if browser is resized to be above 400px
  if (window.innerWidth > 400 && nonStart == true) {
    // Draw background on canvas to be animated
    drawBackground();

    // Animate
    createBackgroundAnimation();
  }

  // When window hits media breakpoint of 570 remove open class
  if (window.innerWidth > 570) {
    // Get elements with open classname
    const open = document.getElementsByClassName('open');
    // Check whether menu is open
    if (open.length !== 0) {
      // Remove class name from element - index 0 because array will only return one element
      open[0].classList.remove('open');
    }
  }
});

// Track mouse - call event when mouse moves on the window
window.addEventListener('mousemove', function(event) {
  // Set mouse object coordinates to event coordinates
  mouse.x = event.x;
  mouse.y = event.y;
});


// Animated home background
// get canvas context
const context = canvas.getContext('2d');
// Set canvas height and width
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Empty paticles array
let particles = [];

// Create object to store mouse coordinates and radius
let mouse = {
  x : null,
  y : null,
  radius : 50
}

// Create object to store touch coordinates
let touch = {
  x : null,
  y : null
}

// Create function to draw image
function createBackgroundAnimation() {
  // set picture dimensions
  let picWidth = png.width;
  let picHeight = png.height;
  // image data
  const pictureCoordinates = context.getImageData(3, 0, 350, 100);
  // clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // function to initialise particles
  function init() {
    // arrays
    particles = [];
    floatingText = [];
    // variable for the particle spacing
    let particleSpacing;
    context.clearRect(0, 0, innerWidth, innerHeight);
    // Loop to search through every row of image data
    for (let y = 0, y2 = pictureCoordinates.height; y < y2; y++) {
      // Loop through each column of the current row to search for visible pixels
      for (let x = 0, x2 = pictureCoordinates.width; x < x2; x++) {
        // Checking each fourth index of image data is greater than 128,
        // 128 represents 50% opacity
        if (pictureCoordinates.data[(y * 4 * pictureCoordinates.width) + (x * 4) + 3] > 128) {
          // Store x and y position in order to create particle in that location
          let positionX = x;
          let positionY = y;
          // variable to store colour, image data stores colours in rgb
          // must extract the indexes storing the red, green and blue rgb data
          let colour = 'rgb(' + pictureCoordinates.data[(y * 4 * pictureCoordinates.width) + (x * 4)] + ',' +
                                pictureCoordinates.data[(y * 4 * pictureCoordinates.width) + (x * 4) + 1] + ',' +
                                pictureCoordinates.data[(y * 4 * pictureCoordinates.width) + (x * 4) + 2] + ')';

          // Check cavas width
          if (canvas.width >= 1300) {
            particleSpacing = 3;
          } else if (canvas.width > 900 && canvas.width <= 1299) {
            particleSpacing = 2.5;
          } else if (canvas.width > 724 && canvas.width <= 899) {
            particleSpacing = 2;
          } else if (canvas.width > 550 && canvas.width <= 724) {
            particleSpacing = 1.5;
          } else if (canvas.width > 400 && canvas.width <= 550) {
            particleSpacing = 1.1;
          }

          // instatitate new particle and push into particle array
          particles.push(new Particle(positionX * particleSpacing, positionY * particleSpacing, colour))
        }
      }
    }
  }
  // Function that will run recursively and create animation loop
  function animate() {
    if (pause) {
      return;
    }
    // Create animation loop by calling animate recursively
    requestAnimationFrame(animate);

    // clear canvas
    context.clearRect(0, 0, innerWidth, innerHeight);

    // Loop through particles array
    for (let i = 0; i < particles.length; i ++) {
      // Update each particle
      particles[i].update();
    }
  }

  // Pause animation if it is off screen
  function pauseAnimation() {
    // Get element size info
    let homeSize = home.getBoundingClientRect();

    // If the bottom of the home section is above client view
    if (homeSize.bottom <= 0) {
      // Pause animation
      pause = true;
    } else if (pause) {
      // Set pause to false
      pause = false;

      requestAnimationFrame(animate);
    }
  }

  // Call functions
  init();
  animate();

  // Add callback function that runs every time the window is resized
  window.addEventListener('resize', function() {
    // Reset width and height of canvas to make canvas and everything inside
    // responsive
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();

    // Check if animation has not started and if browser is resized to be above 400px
    if (window.innerWidth < 400) {
      // Pause animation
      pause = true;
    } else if(pause == true && window.innerWidth > 400 && inView(home)) {
      // Set pause to false
      pause = false;

      requestAnimationFrame(animate);
    }
  });

  // Add event listener within animate context that listens for scroll
  window.addEventListener('scroll', pauseAnimation);
}


// Functions
// Draw background in canvas for animation
function drawBackground() {
  // Set font family
  context.font = "italic bolder 30px georgia";
  // Set text colour
  context.fillStyle = 'rgb(255,255,255)';
  // draw tags
  context.fillText('<', 0, 35);
  context.fillText('>', 117, 35);
  context.fillText('</', 201, 83);
  context.fillText('>', 328, 83);
  // Set text colour
  context.fillStyle = 'rgb(16,206,65)';
  // draw writing
  context.fillText('Brook', 21, 35);
  // draw image
  context.drawImage(png, 120, 0);
  // draw writing
  context.fillText('Smith', 235, 83);
}
// Function to display menu when in mobile responsive display
function toggleMenu() {
  // Get menu element
  const nav = document.getElementById('menu');
  // Check to see if responsive menu is already open
  const open = nav.classList.contains('open');
  // If it is not open the add open class
  if (open == false) {
    // Add class to nav menu to open mobile responsive menu
    nav.classList.add('open');
  } else {
    // Add close class for smooth close transition
    nav.classList.add('close');

    setTimeout(function() {
      // if it is open then remove class to close it
      nav.classList.remove('open');
      nav.classList.remove('close');
    }, 600);
  }
}

// Function to display chevrons based on where the user is on the page
function displayChevrons() {
  // Hide chevron icons if they cannot go any further
  if (window.scrollY == 0) {
    // get icon by id and store in variable
    const upChevron = document.getElementById('upChevron');
    // Change display of icon
    upChevron.style.opacity = 0;
  } else {
    // Change display of icon
    upChevron.style.opacity = 1;
  }

  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    // get icon by id and store in variable
    const downChevron = document.getElementById('downChevron');
    // Change display of icon
    downChevron.style.opacity = 0;
  } else {
    // Change display of icon
    downChevron.style.opacity = 1;
  }
}

// Function to go up a section when click
function scroll(direction) {
  // get window height so scroll will go full page
  let viewHeight = window.innerHeight;

  // Switch case to determine scolling up or down a page
  switch (direction) {
    case 'up' :
      // Scroll up by full page
      window.scrollBy(0, -viewHeight);
      break;
    case 'down' :
    // Scroll down by full page
    window.scrollBy(0, viewHeight);
    break;
  }
}


// Function to check which element is currently in view
function inView(element) {
  // Return Object providing information about the size of the element
  elemSize = element.getBoundingClientRect();

  // Return root element with all children
  baseElement = document.documentElement;

  return (
    elemSize.top >= 0 && elemSize.left >= 0 &&
     elemSize.bottom <= (window.innerHeight || baseElement.clientHeight) &&
     elemSize.right <= (window.innerWidth || baseElement.clientWidth)
  );
}

// Change header colour depending on section
function headerColour() {
  // Get sections
  const sections = document.getElementsByClassName('nav-point');

  // Get menu toggle button
  const toggle = document.getElementById('toggleMenu');

  // Get nav bar
  const navbar = document.getElementById('menu');

  // Get navbar links
  const links = document.getElementsByClassName('nav-link');

  // Get chevrons
  const chevrons = document.getElementsByClassName('scroll');

  // Loop through sections and change header colour to corresponding colour on
  // array index if it is in view
  for (let i = 0; i < sections.length; i++) {
    // Check if section is in view
    if (inView(sections[i])) {
      // Change colour of navbar
      navbar.style.backgroundColor = colours[i];

      // Change colour of chevrons to match section colour
      chevrons[0].style.color = colours[i];
      chevrons[1].style.color = colours[i];

      // Set class of link for section in view to active
      links[i].classList.add('active');
      links[i].style.color = colours[i];
      toggle.style.backgroundColor = colours[i];
    } else if (links[i].classList.contains('active')){
      // Remove active class and change text colour back to white
      links[i].classList.remove('active');
      links[i].style.color = 'white';
    }
  }
}

// Chnage link text colour over header
function hoverTextColour() {
  // Get navbar links
  const links = document.getElementsByClassName('nav-link');

  // Loop through all links in class
  for (let i = 0; i < links.length; i++) {
    // Create event listener for hover
    links[i].addEventListener('mouseenter', function() {
      // Change text colour to colour of header
      links[i].style.color = colours[i];
    });
    // Event listener to change back to white when no longer hovering over
    links[i].addEventListener('mouseleave', function() {
      if (!links[i].classList.contains('active')) {
        // Change text colour to colour of header
        links[i].style.color = 'white';
      }
    });
  }
}

// Slide in about content
function slideInAboutContent() {
  // Get about content options
  const aboutContent = document.getElementsByClassName('content-option');
  // Loop through options
  for (let i = 0; i < aboutContent.length; i++) {
    // If content is in view then add slide in class to trigger animation
    if(inView(aboutContent[i])) {
      aboutContent[i].classList.add('slideIn');
    }
  }
}

// Create click events for content to display modal with content
function displayContent() {
  // Get about content options
  const content = document.getElementsByClassName('content-option');

  // Loop through options
  for (let i = 0; i < content.length; i++) {
    // add event listeners to open modal
    content[i].addEventListener('click', function() {
      // Get element id to decipher what content needs to be loaded
      const id = content[i].id;
      // Get header text
      const headerText = content[i].getElementsByTagName('h2')[0].innerHTML;

      // Call function to open modal
      openModal(id, headerText);
    });
  }
}

function openModal(id, headerText) {
  // Get navbar colour
  const colour = document.getElementById('menu').style.backgroundColor;
  // Get backdrop element
  const backdrop = document.getElementById('backdrop');
  // Get modal
  const modal = document.getElementById('modal');
  const modalNav = document.getElementById('modal-nav');
  // Get header text
  const header = modal.getElementsByTagName('h1')[0];
  // Get close button
  const close = document.getElementById('close-modal');
  // Get modal content
  const modalContent = document.getElementsByClassName(id);

  switch (id) {
    case 'personal':
      break;
    case 'education':
      break;
    case 'hobbies':
      break;
  }

  // Set nav colour
  modalNav.style.backgroundColor = colour;
  // Add header
  header.innerHTML = headerText;
  // Open Modal
  // display backdrop
  backdrop.setAttribute('style', 'display: block; opacity: 1;');
  // Display modal box
  modal.style.display = 'block';
  // Loop through and display content
  for (let i = 0; i < modalContent.length; i++) {
    modalContent[i].style.display = 'flex';
  }
  // Trigger animation
  modal.classList.add('slideUp');
  // Create event listener to close modal
  close.addEventListener('click', function() {
    // Hide backdrop
    backdrop.setAttribute('style', 'display: none; opacity: 0;');
    // Hide modal
    modal.style.display = 'none';
    // Loop through and hide content
    for (let i = 0; i < modalContent.length; i++) {
      modalContent[i].style.display = 'none';
    }
    // Remove class so animation can be triggered again
    modal.classList.remove('slideUp');
  });
}

function timelineModal() {
  // Get timeline element
  const timeline = document.getElementsByClassName('timeline-content');
  // Get all content elements within the timeline
  const timelineContent = timeline[0].getElementsByClassName('content');

  // Loop through content
  for (let i = 0; i < timelineContent.length; i++) {
    // Event listener for when user clicks on contact me button
    timelineContent[i].addEventListener('click', function() {
      const headerText = timelineContent[i].getElementsByTagName('h4')[0].innerHTML;
      // Open modal with contact form
      openModal(timelineContent[i].id, headerText);
    });
  }

}

function openEmail(form) {
  // Get subject text
  const subject = form.subject.value;
  // Get body text
  const body = form.body.value;

  // Open Email client
  window.open(`mailto:SBrook044@gmail.com?subject=${subject}&body=${body}`);
}
