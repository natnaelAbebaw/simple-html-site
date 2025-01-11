const inputField = document.getElementById("search-input") as HTMLInputElement;
const form = document.getElementById("form") as HTMLFormElement;
const resultsElement = document.getElementById("results") as HTMLUListElement;

type CommentType = {
  id: string;
  postId: string;
  name: string;
  email: string;
  body: string;
};

//states
let isLoading = false;
let comments: CommentType[] = [];
let currentRequest: XMLHttpRequest | null = null;

// creating a loading Event
const LoadingEvent = new CustomEvent("loadingEvent", {
  detail: { key: "value" },
  bubbles: true,
  cancelable: true,
  composed: true,
});

// ajax request function

function ajaxRequest(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // If there's an ongoing request, abort it
    if (currentRequest) {
      currentRequest.abort();
    }

    // Create a new XMLHttpRequest instance
    const xhr = new XMLHttpRequest();
    currentRequest = xhr;

    xhr.open("GET", url);

    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        console.error(`Request failed with status: ${xhr.status}`);
        reject(new Error(`Request failed with status: ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      console.error("Request failed");
      reject(new Error("Request failed"));
    };

    // Reset currentRequest when the request completes or is aborted
    xhr.onloadend = function () {
      if (currentRequest === xhr) {
        currentRequest = null;
      }
    };

    xhr.send();
  });
}

// rendering the comments

function renderComments(e: Event) {
  resultsElement.innerHTML = "";
  if (isLoading) {
    console.log("loading");
    const div = document.createElement("div");
    const html = `
         <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        </div>
        `;
    div.innerHTML = html;
    resultsElement.appendChild(div);
    return;
  }

  if (inputField.value === "") {
    const div = document.createElement("div");
    const html = `
           <h3>SEARCH FOR A COMMENT</h3>
          `;
    div.innerHTML = html;
    resultsElement.appendChild(div);
    return;
  }

  if (comments.length === 0) {
    const div = document.createElement("div");
    const html = `
         <h3>NO COMMENT FOUND</h3>
        `;
    div.innerHTML = html;
    resultsElement.appendChild(div);
    return;
  }

  comments.forEach((comment) => {
    const li = document.createElement("li");
    const html = `
          <h3>${comment.name}</h3>
          <p>${comment.body}</p>
      `;

    li.innerHTML = html;
    resultsElement.appendChild(li);
  });
}

// set loading state
function setLoading(loadinState: boolean) {
  isLoading = loadinState;
  resultsElement.dispatchEvent(LoadingEvent);
}

async function onSubmit(e: Event) {
  e.preventDefault();

  let q = "";

  if (inputField.value) {
    q = inputField.value;
  }
  const baseUrl = "http://localhost:8000/api/v1/comments?q=" + q;
  try {
    // getting the comments from the API
    setLoading(true);
    const response = await fetch(baseUrl);
    // parsing the response
    const ResponseText = await ajaxRequest(baseUrl);
    comments = JSON.parse(ResponseText).results;
    setLoading(false);
  } catch (error) {
    console.error("Error:", error);
    console.log("error");
    setLoading(false);
    comments = [];
  }
}

// attaching the event listener
resultsElement.addEventListener("loadingEvent", renderComments);
form.addEventListener("submit", onSubmit);
