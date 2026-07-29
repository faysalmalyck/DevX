export interface Testimonial {
  name: string;
  handle: string;
  image: string;
  text: string;
}

export const testimonials: Testimonial[][] = [
  [
    {
      name: "Ethan Carter",
      handle: "@ethancarter",
      image:
        "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/6219317ff4f88a6635ab400d_image-6-testimonials-dev-template.jpg",
      text: "“The team transformed our vision into a fast, scalable platform that exceeded expectations. Their technical expertise, communication, and attention to detail made the entire process seamless.”",
    },
    {
      name: "Sophia Mitchell",
      handle: "@sophiamitchell",
      image:
        "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/6219317f1a61f3a838a3a31b_image-3-testimonials-dev-template.jpg",
      text: "“From planning to deployment, every milestone was delivered on time. The final product is modern, reliable, and has significantly improved our team's productivity.”",
    },
  ],
  [
    {
      name: "Daniel Brooks",
      handle: "@danielbrooks",
      image:
        "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/6219317f9a3a3623493a1bef_image-5-testimonials-dev-template.jpg",
      text: "“Their engineering standards are exceptional. Performance improved dramatically, and the architecture is now much easier to maintain and scale.”",
    },
    {
      name: "Olivia Bennett",
      handle: "@oliviabennett",
      image:
        "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/6219317ffae47e07e7e98f2f_image-2-testimonials-dev-template.jpg",
      text: "“Our website redesign delivered measurable improvements in speed, SEO, and user engagement. The team's recommendations added value well beyond the original scope.”",
    },
  ],
  [
    {
      name: "Lucas Anderson",
      handle: "@lucasanderson",
      image:
        "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/6219317fce4a43f0a82b0baf_image-4-testimonials-dev-template.jpg",
      text: "“Every feature was implemented with precision and delivered within budget. The project management and technical execution were first class from start to finish.”",
    },
    {
      name: "Emma Richardson",
      handle: "@emmarichardson",
      image:
        "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/6219317f566d3fbda05a9813_image-1-testimonials-dev-template.jpg",
      text: "“We now have a future-proof platform built with clean, maintainable code. Their focus on long-term scalability makes them a trusted technology partner for our business.”",
    },
  ],
];