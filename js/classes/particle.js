// class to create particles and handle interactions
class Particle {
  // Constructor method to set properties
  constructor(x, y, colour, size) {
    let responsiveWidth;
    let responsiveHeight;

    // Check cavas width
    if (canvas.width >= 1300) {
      responsiveWidth = 5;
      responsiveHeight = 1.5;
    } else if (canvas.width > 900 && canvas.width <= 1299) {
      responsiveWidth = 4.35;
      responsiveHeight = 1.3;
    } else if (canvas.width > 724 && canvas.width <= 899) {
      responsiveWidth = 3.4;
      responsiveHeight = 1;
    } else if (canvas.width > 550 && canvas.width <= 724) {
      responsiveWidth = 2.6;
      responsiveHeight = 0.8;
    } else if (canvas.width > 400 && canvas.width <= 550) {
      responsiveWidth = 1.9;
      responsiveHeight = 0.5;
    }

    // x and y properties calculation to make sure image is centered
    this.x = x + canvas.width / 2 - png.width * responsiveWidth,
    this.y = y + canvas.height / 2 - png.height * responsiveHeight,
    this.colour = colour,
    this.size = 1,
    this.baseSize = 1,
    this.baseX = x + canvas.width /  2 - png.width * responsiveWidth,
    this.baseY = y + canvas.height / 2 - png.height * responsiveHeight,
    this.density = (Math.random() * 50) + 2
  }

  // draw method
  draw() {
    // save context
    context.save();
    // Draw particle
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.closePath();
    context.fill();

    // restore context
    context.restore();
  }

  // Update method
  update() {
    // Fill particle with colour
    context.fillStyle = this.colour;

    // collision detection
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;

    // Maximum distance the particle be forced away
    const maxDistance = 150;
    // Force change depending on how close to max distance -
    //  closer it is slower it will go
    let force = (maxDistance - distance) / maxDistance;
    // stop force becoming negative number
    if (force < 0) force = 0;

    // Set movement variables - calculation will determine speed of particle
    let directionX = (forceDirectionX * force * this.density);
    let directionY = (forceDirectionY * force * this.density);

    // Move particle when in radius of mouse
    // Randomize radius so particles do not come to standstill at mox distance
    if (distance < (mouse.radius * (Math.random() * 5)) + this.size) {
      // Move particle away from original position
      this.x -= directionX;
      this.y -= directionY;
      // Make particles bubble
      this.size += .5;
    } else {
      // When mouse is not in range - check to see if particle is in original
      // location - if not then move back to location
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 15;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 15;
      }
      // Return particles to original size
      if (this.size !== this.baseSize) {
        let dsize = this.size - this.baseSize;
        this.size -= dsize / 5;
      }
    }
    // Draw image
    this.draw();
  }
}
