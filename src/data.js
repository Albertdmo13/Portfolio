export const portfolioData = {
  en: {
    personalInfo: {
      name: "Alberto Díaz Maroto Ortiz",
      shortName: "Alberto Díaz",
      role: "Computer Engineering Master's Student & Software Developer",
      status: "Available for new opportunities",
      email: "adiazmarotoortiz@gmail.com",
      bio: "I'm a computer engineering master's student passionate about software engineering, game development, and systems programming. I enjoy building clean tools, web apps, and interactive technology where engineering precision meets thoughtful design.",
      links: {
        github: "https://github.com/Albertdmo13",
        linkedin: "https://www.linkedin.com/in/alberto-d%C3%ADaz-maroto-ortiz-348766398/",
        cv: "/Portfolio/data/AlbertoDiaz_CurriculumVitae.pdf",
        email: "mailto:adiazmarotoortiz@gmail.com",
      },
    },
    roles: [
      "Master's Student in Computer Engineering",
      "Software Developer",
      "Researcher at VISILAB",
      "Game Developer",
      "Tech Enthusiast",
    ],
    nav: {
      experience: "Experience",
      projects: "Projects",
      publications: "Publications",
      skills: "Skills",
      contact: "Contact",
      cv: "CV",
    },
    hero: {
      getInTouch: "Get in touch",
    },
    sections: {
      trajectory: "Trajectory & Education",
      projects: "Featured Projects",
      publications: "Publications",
      skills: "Skills & Technologies",
      contact: "Get in Touch",
    },
    trajectory: [
      {
        period: "2026 — Present",
        role: "Master's in Computer Engineering",
        institution: "UCLM Escuela Superior de Informática",
        description: "Graduate studies specializing in advanced software engineering, distributed computing, intelligent systems, and computational research.",
        link: "https://esi.uclm.es",
        logo: "media/LogoUCLM.jpg",
      },
      {
        period: "2024 — Present",
        role: "Assistant Researcher",
        institution: "VISILAB",
        description: "Computer vision and artificial intelligence research laboratory, developing computational experiments and data pipelines.",
        link: "https://visilab.etsii.uclm.es",
        logo: "media/VISILAB_Logo.svg",
      },
      {
        period: "2022 — 2026",
        role: "B.Sc. in Computer Engineering",
        institution: "UCLM Escuela Superior de Informática",
        description: "Comprehensive education covering algorithms, data structures, software architecture, operating systems, and computer graphics.",
        link: "https://esi.uclm.es",
        logo: "media/LogoUCLM.jpg",
      },
    ],
    projects: [
      {
        id: "flowdip",
        title: "FlowDiP",
        subtitle: "Node-based media processing pipeline",
        description: "A node-based web application that empowers users to visually build, connect, and execute real-time video and audio processing graphs directly in the browser.",
        tags: ["React", "JavaScript", "Audio / Video", "Web APIs"],
        video: "/Portfolio/media/flowdip.mp4",
        link: "https://albertdmo13.github.io/FlowDiP/",
        github: "https://github.com/Albertdmo13",
      },
      {
        id: "project-a",
        title: "ProjectA",
        subtitle: "Rogue-like action shooter",
        description: "An action-packed rogue-like adventure shooter featuring procedurally inspired encounters, custom character mechanics, and responsive controls.",
        tags: ["GameMaker", "Aseprite", "Game Design", "Pixel Art"],
        video: "/Portfolio/media/projectA.mp4",
        github: "https://github.com/Albertdmo13",
      },
      {
        id: "mdtmodels",
        title: "MDTModels",
        subtitle: "Machine learning model catalog and repository",
        description: "A web-based catalog and repository application for managing machine learning models. It provides a structured way to store, organize, and retrieve ML models along with their metadata, multiple variants, and associated files.",
        tags: ["Python", "Flask", "MySQL", "Docker"],
        video: "",
        github: "https://github.com/Albertdmo13/MDTModels",
      },
      {
        id: "microdett",
        title: "MicroDetT",
        subtitle: "OpenFlexure Microscope Control App",
        description: "A Python application designed to control the OpenFlexure Microscope on a Raspberry Pi 5. It leverages the Hailo8L AI processor for real-time image analysis and uses the Qt framework for an intuitive control interface.",
        tags: ["Python", "Qt", "Raspberry Pi 5", "Hailo8L AI"],
        video: "",
        github: "https://github.com/Albertdmo13/MicroDetT",
      },
    ],
    publications: [
      {
        title: "Real-Time Edge Computing vs. GPU-Accelerated Pipelines for Low-Cost Microscopy Applications",
        logo: "/Portfolio/media/MDPI-logo-black.svg",
        authors: "Gloria Bueno, Lucia Sanchez-Vargas, Alberto Diaz-Maroto, Jesus Ruiz-Santaquiteria, Maria Blanco, Jesus Salido, Gabriel Cristobal",
        abstract: "Environmental microscopy is crucial for analyzing microorganisms, but traditional optical microscopes are often expensive, bulky, and impractical for field use. AI-driven image recognition, powered by deep learning models like YOLO, enhances microscopy analysis but typically requires high computational resources. To address these challenges, we present two cost-effective pipelines integrating AI with low-cost microscopes and edge computing. [...]",
        link: "https://www.mdpi.com/2079-9292/14/5/930",
        images: [
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g001.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g002.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g003.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g004.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g005.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g006.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g007.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g008.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g009.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g010.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g011.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g012.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g013.png"
        ]
      }
    ],
    skillCategories: [
      {
        name: "Languages",
        skills: ["Python", "JavaScript", "Java", "C / C++", "SQL", "HTML / CSS"],
      },
      {
        name: "Frameworks & Libraries",
        skills: ["React", "Angular", "Node.js", "OpenGL", "Three.js basics"],
      },
      {
        name: "Tools & Systems",
        skills: ["Git", "GitHub", "Linux", "Blender", "GameMaker", "Aseprite", "Arduino"],
      },
      {
        name: "Core Competencies",
        skills: ["Problem Solving", "Software Architecture", "Team Collaboration", "Research & Documentation"],
      },
    ],
    contact: {
      title: "Have a project or opportunity in mind?",
      desc: "I'm always open to discussing new projects, software engineering roles, or research collaborations. Feel free to reach out via email or connect on LinkedIn.",
      emailBtn: "Get in touch",
      copyBtn: "Copy email",
      copiedBtn: "Copied to clipboard!",
      clientBtn: "Open Email Client",
    },
    footer: {
      text: "",
    },
  },
  es: {
    personalInfo: {
      name: "Alberto Díaz Maroto Ortiz",
      shortName: "Alberto Díaz",
      role: "Estudiante de Máster en Ingeniería Informática y Desarrollador de Software",
      status: "Disponible para nuevas oportunidades",
      email: "adiazmarotoortiz@gmail.com",
      bio: "Soy estudiante de máster en Ingeniería Informática apasionado por la ingeniería de software, el desarrollo de videojuegos y la programación de sistemas. Disfruto creando herramientas limpias, aplicaciones web y tecnología interactiva donde la precisión técnica se une con un diseño cuidado.",
      links: {
        github: "https://github.com/Albertdmo13",
        linkedin: "https://www.linkedin.com/in/alberto-d%C3%ADaz-maroto-ortiz-348766398/",
        cv: "/Portfolio/data/AlbertoDiaz_CurriculumVitae.pdf",
        email: "mailto:adiazmarotoortiz@gmail.com",
      },
    },
    roles: [
      "Estudiante de Máster en Ing. Informática",
      "Desarrollador de Software",
      "Investigador en VISILAB",
      "Desarrollador de Videojuegos",
      "Entusiasta de la Tecnología",
    ],
    nav: {
      experience: "Experiencia",
      projects: "Proyectos",
      publications: "Publicaciones",
      skills: "Habilidades",
      contact: "Contacto",
      cv: "CV",
    },
    hero: {
      getInTouch: "Contactar",
    },
    sections: {
      trajectory: "Trayectoria y Educación",
      projects: "Proyectos Destacados",
      publications: "Publicaciones",
      skills: "Habilidades y Tecnologías",
      contact: "Contacto",
    },
    trajectory: [
      {
        period: "2026 — Presente",
        role: "Máster en Ingeniería Informática",
        institution: "UCLM Escuela Superior de Informática",
        description: "Estudios de posgrado especializados en ingeniería de software avanzada, computación distribuida, sistemas inteligentes e investigación computacional.",
        link: "https://esi.uclm.es",
        logo: "media/LogoUCLM.jpg",
      },
      {
        period: "2024 — Presente",
        role: "Investigador Asistente",
        institution: "VISILAB",
        description: "Laboratorio de investigación en visión por computador e inteligencia artificial, desarrollando experimentos computacionales y flujos de datos.",
        link: "https://visilab.etsii.uclm.es",
        logo: "media/VISILAB_Logo.svg",
      },
      {
        period: "2022 — 2026",
        role: "Grado en Ingeniería Informática",
        institution: "UCLM Escuela Superior de Informática",
        description: "Formación integral en algoritmos, estructuras de datos, arquitectura del software, sistemas operativos y computación gráfica.",
        link: "https://esi.uclm.es",
        logo: "media/LogoUCLM.jpg",
      },
    ],
    projects: [
      {
        id: "flowdip",
        title: "FlowDiP",
        subtitle: "Procesador de medios basado en nodos",
        description: "Aplicación web basada en nodos que permite a los usuarios construir, conectar y ejecutar gráficos de procesamiento de vídeo y audio en tiempo real directamente en el navegador.",
        tags: ["React", "JavaScript", "Audio / Vídeo", "Web APIs"],
        video: "/Portfolio/media/flowdip.mp4",
        link: "https://albertdmo13.github.io/FlowDiP/",
        github: "https://github.com/Albertdmo13",
      },
      {
        id: "project-a",
        title: "ProjectA",
        subtitle: "Shooter de acción rogue-like",
        description: "Aventura de acción rogue-like con encuentros procedurales, mecánicas de personajes personalizadas y controles dinámicos.",
        tags: ["GameMaker", "Aseprite", "Diseño de Juegos", "Pixel Art"],
        video: "/Portfolio/media/projectA.mp4",
        github: "https://github.com/Albertdmo13",
      },
      {
        id: "mdtmodels",
        title: "MDTModels",
        subtitle: "Catálogo y repositorio de modelos de machine learning",
        description: "Aplicación web para la gestión, organización y almacenamiento estructurado de modelos de machine learning, incluyendo sus metadatos, múltiples variantes y archivos asociados.",
        tags: ["Python", "Flask", "MySQL", "Docker"],
        video: "",
        github: "https://github.com/Albertdmo13/MDTModels",
      },
      {
        id: "microdett",
        title: "MicroDetT",
        subtitle: "Aplicación de control para OpenFlexure Microscope",
        description: "Aplicación en Python diseñada para controlar el microscopio OpenFlexure en una Raspberry Pi 5. Aprovecha el procesador de IA Hailo8L para análisis de imágenes en tiempo real y utiliza el framework Qt para su interfaz de usuario.",
        tags: ["Python", "Qt", "Raspberry Pi 5", "Hailo8L AI"],
        video: "",
        github: "https://github.com/Albertdmo13/MicroDetT",
      },
    ],
    publications: [
      {
        title: "Real-Time Edge Computing vs. GPU-Accelerated Pipelines for Low-Cost Microscopy Applications",
        logo: "/Portfolio/media/MDPI-logo-black.svg",
        authors: "Gloria Bueno 1,* [ORCID], Lucia Sanchez-Vargas 1, Alberto Diaz-Maroto 1, Jesus Ruiz-Santaquiteria 1 [ORCID], Maria Blanco 1 [ORCID], Jesus Salido 1 [ORCID] and Gabriel Cristobal",
        abstract: "Environmental microscopy is crucial for analyzing microorganisms, but traditional optical microscopes are often expensive, bulky, and impractical for field use. AI-driven image recognition, powered by deep learning models like YOLO, enhances microscopy analysis but typically requires high computational resources. To address these challenges, we present two cost-effective pipelines integrating AI with low-cost microscopes and edge computing. [...]",
        link: "https://www.mdpi.com/2079-9292/14/5/930",
        images: [
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g001.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g002.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g003.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g004.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g005.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g006.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g007.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g008.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g009.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g010.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g011.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g012.png",
        "/Portfolio/media/Publication1_Figures/electronics-14-00930-g013.png"
        ]
      }
    ],
    skillCategories: [
      {
        name: "Lenguajes",
        skills: ["Python", "JavaScript", "Java", "C / C++", "SQL", "HTML / CSS"],
      },
      {
        name: "Frameworks y Librerías",
        skills: ["React", "Angular", "Node.js", "OpenGL", "Three.js básico"],
      },
      {
        name: "Herramientas y Sistemas",
        skills: ["Git", "GitHub", "Linux", "Blender", "GameMaker", "Aseprite", "Arduino"],
      },
      {
        name: "Competencias Clave",
        skills: ["Resolución de Problemas", "Arquitectura de Software", "Trabajo en Equipo", "Investigación y Documentación"],
      },
    ],
    contact: {
      title: "¿Tienes un proyecto o propuesta en mente?",
      desc: "Siempre estoy abierto a conectar con otros desarrolladores, discutir proyectos apasionantes o explorar nuevas oportunidades profesionales. No dudes en escribirme.",
      emailBtn: "Contactar",
      copyBtn: "Copiar email",
      copiedBtn: "¡Copiado al portapapeles!",
      clientBtn: "Abrir cliente de correo",
    },
    footer: {
      text: "",
    },
  },
};

export const personalInfo = portfolioData.en.personalInfo;
export const trajectory = portfolioData.en.trajectory;
export const projects = portfolioData.en.projects;
export const skillCategories = portfolioData.en.skillCategories;
