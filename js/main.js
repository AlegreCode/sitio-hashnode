document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    
    function fetchPosts(page) {
        const query = `query {
            user(username: "alegrecode") {
                posts(pageSize:3, page:${page}) {
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
                const pageInfo = data.data.user.posts.pageInfo;
                const postContainer = document.getElementById("grid_articles");
                
                postContainer.innerHTML = posts.map(post => `
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
                ).join("");

                // Add paginator
                const paginator = `
                    <div class="col-span-full flex justify-center items-center mt-6 gap-4">
                        <button 
                            class="px-4 py-2 bg-blue-500 text-white rounded ${!pageInfo.hasPreviousPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-600'}"
                            ${!pageInfo.hasPreviousPage ? 'disabled' : ''}
                            onclick="changePage(${pageInfo.previousPage})">
                            Previous
                        </button>
                        <span class="text-gray-700">Page ${currentPage}</span>
                        <button 
                            class="px-4 py-2 bg-blue-500 text-white rounded ${!pageInfo.hasNextPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-600'}"
                            ${!pageInfo.hasNextPage ? 'disabled' : ''}
                            onclick="changePage(${pageInfo.nextPage})">
                            Next
                        </button>
                    </div>`;
                postContainer.insertAdjacentHTML('beforeend', paginator);
            });
    }

    // Global function to change page
    window.changePage = function(page) {
        currentPage = page;
        fetchPosts(page);
    }

    // Initial load
    fetchPosts(currentPage);
});