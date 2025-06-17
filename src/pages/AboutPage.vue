<template>
  <div class="about-page">
    <h1>About</h1>
    <div class="about-content">
      <h2>👩‍💻 About the Developers</h2>
      <p>
        <strong>Lior Hen</strong> and <strong>Adar Guenzweig</strong> are outstanding students in the Software Development course at
        <em>Ben-Gurion University of the Negev</em>. Throughout the semester, they have consistently demonstrated
        excellence in programming, user experience design, and project leadership.
      </p>
      <p>
        Their work ethic, attention to detail, and creative problem-solving skills have set them apart as top-tier
        students. Both Lior and Adar are not only technically proficient but also deeply committed to delivering
        user-centric solutions with high standards of quality and functionality. Their collaboration is marked by
        professionalism, innovation, and a clear passion for software craftsmanship.
      </p>

      <h2>🌟 About the Project: <em>Grandma’s Recipes and Others</em></h2>
      <p>
        The <em>Grandma's Recipes and Others</em> project was born from a heartfelt idea: to preserve the magic of
        family recipes and combine it with the ease and power of modern web technologies. It is a single-page
        application (SPA) that serves as a dynamic and personal recipe management and discovery platform.
      </p>

      <h3>🔍 Key Features:</h3>
      <ul>
        <li><strong>Search Recipes</strong> from an existing database by name and filter by cuisine, diet, and intolerance.</li>
        <li>
          <strong>Recipe Preview</strong> components with intuitive visuals including title, preparation time, popularity,
          dietary tags, and interaction history (viewed, saved).
        </li>
        <li>
          <strong>Detailed Recipe Pages</strong> with step-by-step instructions, ingredients, and serving sizes.
        </li>
        <li>
          <strong>Interactive Cooking Mode</strong> to help users follow recipes step-by-step.
        </li>
        <li>
          <strong>Personal Area for Logged-In Users</strong>, where users can:
          <ul>
            <li>Save and manage favorite recipes</li>
            <li>Create and upload personal or family recipes</li>
            <li>Store cherished handwritten notes in a digital format</li>
          </ul>
        </li>
        <li><strong>Random Recipe Suggestions</strong> for culinary inspiration.</li>
        <li><strong>Dynamic Navigation Bar</strong> based on login status (guest or user).</li>
        <li>
          <strong>Registration/Login System</strong> with validation and country selection via external API.
        </li>
        <li>
          All pages load once with smooth transitions, in accordance with SPA principles.
        </li>
      </ul>

      <p>
        This platform does not only help users explore and save recipes—it tells stories through food. It is a modern
        homage to the tradition of passing down recipes from generation to generation.
      </p>

      <h3>🌐 Previous Works by the Team</h3>
      <ul>
        <li>
          🔗 <a href="https://wed-2023.github.io/208883991/" target="_blank">Assignment 1 – Adar Gruenzweig</a>
        </li>
        <li>
          🔗 <a href="https://wed-2023.github.io/209124361/" target="_blank">Assignment 1 – Lior Chen</a>
        </li>
        <li>
          🔗 <a href="https://wed-2023.github.io/assignment2-209124361_208883991_assignment2/" target="_blank">
            Assignment 2</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style scoped>
.about-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.about-content {
  margin-top: 2rem;
}

.about-content ul {
  margin-left: 1.5rem;
  list-style-type: disc;
}

.about-content a {
  color: #007acc;
  text-decoration: none;
}

.about-content a:hover {
  text-decoration: underline;
}
</style>