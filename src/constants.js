// URLs, textures, and constants
export const skills_icons_url = "/Portfolio/icons/skills_icons";
export const nine_slice_texture = "/Portfolio/misc/9_slice.png";
export const nine_slice_texture2 = "/Portfolio/misc/9_slice_2.png";
export const carpet_nine_slice_texture = "/Portfolio/misc/carpet_9_slice.png";
export const chest_inventory_texture = "/Portfolio/misc/chest_inventory_test.png";
export const BACKGROUND_IMAGE_BASE_HEIGHT_PX = 300;
export const SKILLS_TITLE_IMG = "/Portfolio/misc/skills.png";
export const SOFT_SKILL_CARD = "/Portfolio/misc/SoftSkillCard.png";

export const cardBackgrounds = [
  "/Portfolio/misc/GameCardBackground1.png",
  "/Portfolio/misc/GameCardBackground2.png",
  "/Portfolio/misc/GameCardBackground3.png",
  "/Portfolio/misc/GameCardBackground4.png",
];

export const gameCards = [
  "/Portfolio/misc/GameCard1.png",
  "/Portfolio/misc/GameCard2.png",
  "/Portfolio/misc/GameCard3.png",
];

export const gameCards_small = [
  "/Portfolio/misc/GameCard1_small.png",
  "/Portfolio/misc/GameCard2_small.png",
  "/Portfolio/misc/GameCard3_small.png",
];

export const hardSkills = [
  {
    name: "Angular",
    icon_url: skills_icons_url + "/angular.png",
    color_icon_url: skills_icons_url + "/angular_color.png",
    cardBackground: cardBackgrounds[2],
    category: "Web",
    mastery: 0,
    description: "Framework for building dynamic web applications.",
  },
  {
    name: "Arduino",
    icon_url: skills_icons_url + "/arduino.png",
    color_icon_url: skills_icons_url + "/arduino_color.png",
    cardBackground: cardBackgrounds[0],
    category: "Embedded",
    mastery: 1,
    description: "Open-source hardware platform for electronics projects.",
  },
  {
    name: "Aseprite",
    icon_url: skills_icons_url + "/aseprite.png",
    color_icon_url: skills_icons_url + "/aseprite_color.png",
    cardBackground: cardBackgrounds[3],
    category: "Art",
    mastery: 2,
    description: "Pixel art and 2D animation editor.",
  },
  {
    name: "Blender",
    icon_url: skills_icons_url + "/blender.png",
    color_icon_url: skills_icons_url + "/blender_color.png",
    cardBackground: cardBackgrounds[1],
    category: "Art",
    mastery: 1,
    description: "3D creation suite for modeling, animation, and rendering.",
  },
  {
    name: "CSS",
    icon_url: skills_icons_url + "/css.png",
    color_icon_url: skills_icons_url + "/css_color.png",
    cardBackground: cardBackgrounds[2],
    category: "Web",
    mastery: 1,
    description: "Language for styling and designing web pages.",
  },
  {
    name: "GameMaker",
    icon_url: skills_icons_url + "/gamemaker.png",
    color_icon_url: skills_icons_url + "/gamemaker_color.png",
    cardBackground: cardBackgrounds[1],
    category: "Game Dev",
    mastery: 2,
    description: "Game engine for creating 2D games easily.",
  },
  {
    name: "Git",
    icon_url: skills_icons_url + "/git.png",
    color_icon_url: skills_icons_url + "/git_color.png",
    cardBackground: cardBackgrounds[0],
    category: "SW Dev",
    mastery: 1,
    description: "Distributed version control system for source code.",
  },
  {
    name: "GitHub",
    icon_url: skills_icons_url + "/github.png",
    color_icon_url: skills_icons_url + "/github_color.png",
    cardBackground: cardBackgrounds[1],
    category: "SW Dev",
    mastery: 1,
    description: "Platform for hosting and collaborating on Git projects.",
  },
  {
    name: "Java",
    icon_url: skills_icons_url + "/java.png",
    color_icon_url: skills_icons_url + "/java_color.png",
    cardBackground: cardBackgrounds[3],
    category: "SW Dev",
    mastery: 0,
    description: "Object-oriented programming language for multiple platforms.",
  },
  {
    name: "JavaScript",
    icon_url: skills_icons_url + "/js.png",
    color_icon_url: skills_icons_url + "/js_color.png",
    cardBackground: cardBackgrounds[1],
    category: "Web",
    mastery: 0,
    description: "Essential language for web interactivity and logic.",
  },
  {
    name: "Linux",
    icon_url: skills_icons_url + "/linux.png",
    color_icon_url: skills_icons_url + "/linux_color.png",
    cardBackground: cardBackgrounds[2],
    category: "SW Dev",
    mastery: 1,
    description: "Open-source operating system known for stability and power.",
  },
  {
    name: "OpenGL",
    icon_url: skills_icons_url + "/opengl.png",
    color_icon_url: skills_icons_url + "/opengl_color.png",
    cardBackground: cardBackgrounds[3],
    category: "SW Dev",
    mastery: 1,
    description: "API for rendering real-time 2D and 3D graphics.",
  },
  {
    name: "Photoshop",
    icon_url: skills_icons_url + "/photoshop.png",
    color_icon_url: skills_icons_url + "/photoshop_color.png",
    cardBackground: cardBackgrounds[1],
    category: "Art",
    mastery: 1,
    description: "Professional tool for image editing and design.",
  },
  {
    name: "Python",
    icon_url: skills_icons_url + "/python.png",
    color_icon_url: skills_icons_url + "/python_color.png",
    cardBackground: cardBackgrounds[0],
    category: "SW Dev",
    mastery: 2,
    description: "Versatile language for development, AI, and automation.",
  },
  {
    name: "React",
    icon_url: skills_icons_url + "/react.png",
    color_icon_url: skills_icons_url + "/react_color.png",
    cardBackground: cardBackgrounds[3],
    category: "Web",
    mastery: 0,
    description: "Library for building dynamic user interfaces.",
  },
  {
    name: "SQL",
    icon_url: skills_icons_url + "/sql.png",
    color_icon_url: skills_icons_url + "/sql_color.png",
    cardBackground: cardBackgrounds[3],
    category: "Data",
    mastery: 1,
    description: "Language for managing relational databases.",
  },
];

export const softSkills = [
  {
    name: "Teamwork",
    icon_url: skills_icons_url + "/teamwork.png",
    color_icon_url: skills_icons_url + "/teamwork.png",
    cardBackground: cardBackgrounds[0],
    category: "Soft",
    mastery: 1,
    description: "Collaborating effectively with others.",
  },
  {
    name: "Problem Solving",
    icon_url: skills_icons_url + "/problem_solving.png",
    color_icon_url: skills_icons_url + "/problem_solving.png",
    cardBackground: cardBackgrounds[1],
    category: "Soft",
    mastery: 1,
    description: "Finding solutions to complex issues.",
  },
  {
    name: "Communication",
    icon_url: skills_icons_url + "/communication.png",
    color_icon_url: skills_icons_url + "/communication.png",
    cardBackground: cardBackgrounds[2],
    category: "Soft",
    mastery: 1,
    description: "Conveying ideas clearly.",
  },
  {
    name: "Adaptability",
    icon_url: skills_icons_url + "/adaptability.png",
    color_icon_url: skills_icons_url + "/adaptability.png",
    cardBackground: cardBackgrounds[3],
    category: "Soft",
    mastery: 1,
    description: "Adjusting to new challenges.",
  },
];

export const sparkFrames = [
  "/Portfolio/spark/spark1.png",
  "/Portfolio/spark/spark2.png",
  "/Portfolio/spark/spark3.png",
  "/Portfolio/spark/spark4.png",
  "/Portfolio/spark/spark5.png",
  "/Portfolio/spark/spark6.png",
  "/Portfolio/spark/spark7.png",
  "/Portfolio/spark/spark8.png",
  "/Portfolio/spark/spark9.png",
  "/Portfolio/spark/spark10.png",
];

export const headerButtons = {
  github: {
    normal: "/Portfolio/header_buttons/btn_github.png",
    hover: "/Portfolio/header_buttons/btn_github_hovered.png",
    link: "https://github.com/Albertdmo13",
  },
  linkedin: {
    normal: "/Portfolio/header_buttons/btn_linkedin.png",
    hover: "/Portfolio/header_buttons/btn_linkedin_hovered.png",
    link: "https://www.linkedin.com/in/alberto-d%C3%ADaz-maroto-ortiz-348766398/",
  },
  cv: {
    normal: "/Portfolio/header_buttons/btn_curriculum.png",
    hover: "/Portfolio/header_buttons/btn_curriculum_hovered.png",
    link: "/Portfolio/curriculum.pdf",
  },
};

export const dotFrames = [
  skills_icons_url + "/dot1.png",
  skills_icons_url + "/dot2.png",
  skills_icons_url + "/dot3.png",
  skills_icons_url + "/dot4.png",
  skills_icons_url + "/dot5.png",
  skills_icons_url + "/dot6.png",
  skills_icons_url + "/dot7.png",
  skills_icons_url + "/dot8.png",
];

export const projects = [
  {
    title: "ProjectA",
    description: "Video game project I have been working on in my free time. Rogue-like adventure shooter with fantasy and RPG elements. Currently under development.",
    video: "/Portfolio/media/projectA.mp4",
    pixelArt: true,
    tags: ["Game", "Rogue-like", "RPG"],
    techStack: [
      skills_icons_url + "/gamemaker_color.png",
      skills_icons_url + "/aseprite_color.png",
    ],
  },
  {
    title: "FlowDiP",
    description: "Node-based web application that allows users to create video and audio processing pipelines.",
    video: "/Portfolio/media/flowdip.mp4",
    pixelArt: false,
    tags: ["Web", "Audio", "Video"],
    techStack: [
      skills_icons_url + "/react_color.png",
      skills_icons_url + "/js_color.png",
      skills_icons_url + "/css_color.png",
    ],
    link: "https://albertdmo13.github.io/FlowDiP/",
  },
];

// Helpers
export const getSkillsIconUrls = () => hardSkills.map((skill) => skill.icon_url);
