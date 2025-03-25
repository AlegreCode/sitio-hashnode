document.addEventListener("DOMContentLoaded", function () {
    const query = `query {
    user(username: "alegrecode") {
      posts(pageSize:3, page:1) {
      		pageInfo {
            hasPreviousPage
            hasNextPage
            previousPage
            nextPage
          }
      		totalDocuments
          nodes {
            title
            brief
            url
            coverImage {
              url
            }
            author {
              username 
            }
          }
        }
      }
    }`;

    fetch("https://gql.hashnode.com/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            query: query,
        })
    }).then(response => response.json())
        .then(data => {
        const posts = data.data.user.posts.nodes;
        const postContainer = document.getElementById("grid_articles");
        postContainer.innerHTML = posts.map(post => {
            return `
            <a href="${post.url}" target="_blank">
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <img src="${post.coverImage.url}" alt="Cover Image 1" class="w-full h-auto object-cover">
                    <div class="p-4">
                        <h2 class="text-xl font-bold mb-2">${post.title}</h2>
                        <p class="text-gray-600 text-sm mb-2">${post.author.username}</p>
                        <p class="text-gray-700">${post.brief}</p>
                    </div>
                </div>
            </a>`
        }).join("");
    });
});