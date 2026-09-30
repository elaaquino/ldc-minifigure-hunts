# LEGOLAND Discovery Center Bay Area Scavenger Hunt Web App
A full-stack web application independently designed and developed to improve the scavenger hunt experience at my workplace.

## Purpose
At LEGOLAND Discovery Center Bay Area, guests can participate in scavenger hunts by finding hidden minifigures throughout the Miniland exhibit. Traditionally, parents would take individual photos of each minifigure while also keeping track of the scavenger hunt sheet. When claiming a prize, employees may then need to scroll through several photos to verify that the hunt was completed.

I saw an opportunity to simplify this process and independently designed and developed a web application that allows guests to complete and track their scavenger hunts directly from their phones.

Guests can view the minifigures they need to find, upload photos as they progress, and easily see when a hunt has been completed. Secret hunts can also be unlocked through a code given to guests who participate in certain activities, such as Creative Workshop sessions.

## Admin Dashboard
Because the available scavenger hunts rotate throughout the year, I wanted the application to be maintainable without requiring changes to the source code.

I developed a protected admin dashboard that allows authorized users to:

- Create new scavenger hunts

- Edit existing hunts

- Move hunts between Active, Draft, and Stored states

- Designate hunts as secret/bonus hunts

- Add or remove individual scavenger hunt items

- Upload reference images

- Reintroduce previously stored seasonal hunts

Changes made through the dashboard are stored in the application's database and reflected on the guest-facing website.

## Technologies

- React
- Vite
- JavaScript
- CSS
- Supabase
  - PostgreSQL Database
  - Authentication
  - Storage
  - Row Level Security
- Vercel

## Design

The guest-facing portion of the application is designed primarily for mobile devices, since guests are expected to use the scavenger hunt while walking through the attraction.

The admin dashboard is designed primarily for desktop use to make managing hunts and their content easier for employees.

## Project Status

The project was independently proposed and developed as a personal initiative and has been approved for use at my workplace. It is currently being prepared for deployment and review.

## Notes

This is an independently developed project and is not an official LEGOLAND Discovery Center or LEGO Group software product. References to the workplace describe the environment and use case that motivated the project.
