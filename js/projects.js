import { createCard } from './index.js';

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");

  fetch("https://raw.githubusercontent.com/ironhack-jc/mid-term-api/main/projects")
    .then((res) => res.json())
    .then((data) => {
      const project = data.find((p) => p.uuid === projectId);

      if (!project) {
        document.querySelector(".project-details").innerHTML = "<p>Project not found.</p>";
        return;
      }

      renderProjectDetail(project);

      const otherProjects = data.filter((p) => p.uuid !== projectId).slice(0, 3);
      renderOtherProjects(otherProjects);
    })
    .catch((err) => {
      console.error("Error loading project:", err);
      document.querySelector(".project-details").innerHTML = "<p>Error loading project.</p>";
    });
});

function renderProjectDetail(project) {
  const container = document.querySelector(".project-details");
  container.innerHTML = `
    <section class="project-main">
    
      <h1>${project.name}</h1>
      <p class="project-meta">
      ${project.description}
      <span>${project.completed_on}</span>
      </p>
      <img 
      src="${project.image}" 
      alt="${project.name}" 
      class="project-image"
      style="view-transition-name: project-image-${project.uuid};"
      />
      <p>${project.content}</p>
    
    </section>
  `;
}

function renderOtherProjects(projects) {
  const wrapper = document.querySelector(".other-projects__wrapper");
  projects.map((project) => {
    wrapper.appendChild(createCard(project));
  });
}
