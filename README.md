# PosterOven

## Inspiration

The idea for PosterOven originated when I was searching for posters to decorate my new college room. While I found some appealing designs, they didn't feature the artists I liked. This led me to create my own posters using the Python Imaging Library (PIL). Recognizing the potential, I decided to develop a website to streamline the process for others.

## What It Does

PosterOven allows users to generate custom posters featuring their favorite album art. The platform uses the spotify API to fetch artwork and provides an interface for users to create their own designs.

## The Build Process

The development process involved several key steps:

1. **Initial Development**: I began by creating Python scripts using the PIL framework to design posters.

2. **Integration with Next.js**: Attempted to integrate these Python scripts into a Next.js project. While this setup worked locally, it faced challenges when deployed on Vercel.

3. **Backend API with Flask**: To address deployment issues, I encapsulated the Python scripts within a Flask API and hosted it on Koyeb.

4. **Frontend Development**: Developed the frontend using Next.js, resulting in a fully functional project with customization options and auto-reloading features.

## Challenges We Ran Into

- **Deployment Issues**: Running Python scripts within a Next.js project posed challenges, especially during deployment on Vercel.
- **Integration**: Ensuring seamless communication between the Next.js frontend and the Flask backend required careful handling.

## Accomplishments That We're Proud Of

- Successfully developed a platform that enables users to create and customize posters featuring their favorite artists.
- Overcame technical challenges related to integrating different technologies and deploying the application.

## What We Learned

- Gained experience in integrating Python-based APIs with a Next.js frontend.
- Learned to troubleshoot deployment issues and adapt to platform-specific constraints.

## What's Next for PosterOven

- **Mobile Support**: Planning to enhance the platform with mobile support to reach a broader audience.
- **Marketing Efforts**: Considering marketing strategies to increase site visits and user engagement.
- **User Feedback**: Will gather user feedback to identify areas for improvement and potential new features.

Visit PosterOven at [https://posteroven.vercel.app/](https://posteroven.vercel.app/).
