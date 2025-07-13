// importing custom elements
import { CustomNavbar } from './components/CustomNavbar.mjs';
import { SubscribeBox } from './components/SubscribeBox.mjs';
import { CustomFooter } from './components/CustomFooter.mjs';
import { ScrollToTop } from './components/ScrollToTop.mjs';


// Load card data from the API
// and render the projects section
window.addEventListener('DOMContentLoaded', () => {
   

    fetch("https://raw.githubusercontent.com/ironhack-jc/mid-term-api/main/projects")
        .then(response => response.json())
        .then(data => {
            // Handle the data here
            console.log(data);
            renderProjects(data)
        })
        .catch(error => {
            // Handle errors here
            console.error('Error fetching projects:', error);
        });

        

});  



// Register custom elements
function renderProjects(projects) {
    const wrapperCards = document.querySelector('.card__wrapper');
    projects.reverse().slice(0,3).map(project =>
        wrapperCards.appendChild(createCard(project)))

}
// Function to create a project card
export function createCard(project) {
    const article = document.createElement('article');
    article.className = 'card';

    const imgContainer = document.createElement('div');
    imgContainer.className = 'img__container';
    const img = document.createElement('img');
    img.src = `../assets/projects-section/${project.uuid}.webp` || project.image; 
    img.alt = project.name || 'Project image';
    img.setAttribute("style", `view-transition-name: project-image-${project.uuid};`);

    const cardContent = document.createElement('div');
    cardContent.className = 'card__content';

    const title = document.createElement('h3');
    title.textContent = project.name || 'Project Title';

    const description = document.createElement('p');
    description.textContent = project.description || 'Project description';

    const link = document.createElement('a');
    link.href = `/pages/project.html?id=${project.uuid}`
    link.textContent='Learn more';
    
    

    imgContainer.appendChild(img);

    cardContent.appendChild(title);
    cardContent.appendChild(description);
    cardContent.appendChild(link);


    article.appendChild(imgContainer);
    article.appendChild(cardContent);


    return article;
}