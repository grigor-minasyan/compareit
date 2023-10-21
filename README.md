# Compareit.ai

Compareit.ai is a web application designed for efficient product comparison using customer reviews sourced from Amazon. It provides users with a modern, responsive, and visually appealing user interface powered by Next.js and TailwindCSS. The project also incorporates various technologies and tools to optimize performance and enhance the user experience.

**Disclaimer**: The Compareit.ai website is currently disconnected from the Amazon Products API.

## Features

- **Efficient Product Comparison**: Compare products based on customer reviews from Amazon, allowing users to make informed decisions.

- **Modern UI Design**: The application is designed with a responsive and visually appealing user interface, thanks to TailwindCSS.

- **Optimized API Usage**: Redis is integrated for rate limiting and caching of third-party APIs, resulting in improved overall performance.

- **Intelligent Analysis**: OpenAI's GPT-3.5 chat completions are used to intelligently analyze and extract pros and cons for each product, providing valuable insights to users.

- **Real-time Response**: Server-Sent Events (SSE) are employed for real-time response delivery, ensuring a seamless and engaging user experience.

## Getting Started

To get started with Compareit.ai, follow these steps:

1. Clone this repository:

git clone https://github.com/yourusername/compareit-ai.git


2. Install the dependencies:

npm install


3. Start the development server:

npm run dev


4. Open your browser and visit [http://localhost:3000](http://localhost:3000) to access Compareit.ai.

## Technologies Used

- Next.js
- TailwindCSS
- Redis
- OpenAI GPT-3.5
- Server-Sent Events (SSE)
