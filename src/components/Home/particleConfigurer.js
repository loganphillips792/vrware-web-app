let defaultConfig = {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 1000
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#FFFFFF"
        },
        polygon: {
          nb_sides: 5
        },
        image: {
          src: "img/github.svg",
          width: 100,
          height: 100
        }
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.2,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 6,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "window",
      events: {
        onhover: {
          enable: true,
          mode: "bubble"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true
  };
  
  let particlePresets = {
      def: {
          particles: 100,
          width: 0,
          distance: 150,
          line_opacity: 0.4,
          speed: 6
      },
      thick: {
          particles: 150,
          width: 5,
          distance: 160,
          line_opacity: 0.5,
          speed: 10
      },
      nebulous: {
          particles: 180,
          width: 0,
          distance: 200,
          line_opacity: 0.5,
          speed: 7
      }
  };
  
  function particleConfig(settings) {
      let main = {...defaultConfig}
      main.particles.number.value = settings.particles;
      main.particles.shape.stroke.width = settings.width;
      main.particles.line_linked.distance = settings.distance;
      main.particles.line_linked.opacity = settings.line_opacity;
      main.particles.move.speed = settings.speed;
      return main.particles;
  }
  
  export {particleConfig, particlePresets};