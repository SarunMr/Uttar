import QuestionCard from "../components/Question.jsx";
import UttarSidebar from "../components/UttarSidebar.jsx";
import UttarFooter from "./../components/Footer.jsx";
import UttarHeader from "./../components/Header.jsx";
export default function Homepage() {
  const sampleQuestions = [
    {
      title: "How to implement authentication in React with JWT tokens?",
      excerpt:
        "I'm building a React application and need to implement JWT-based authentication. What's the best approach for handling login, token storage, and protecting routes?",
      tags: ["React", "JWT", "Authentication"],
      votes: 15,
      answers: 3,
      views: 127,
      author: "john_dev",
      time: "2 hours ago",
    },
    {
      title: "Best practices for API error handling in Node.js",
      excerpt:
        "What are the recommended patterns for handling errors in a Node.js REST API? Should I use middleware or handle errors in each route?",
      tags: ["Node.js", "API", "Error Handling"],
      votes: 8,
      answers: 2,
      views: 89,
      author: "sarah_codes",
      time: "4 hours ago",
    },
    {
      title: "Understanding Rust ownership and borrowing",
      excerpt:
        "I'm new to Rust and struggling with the ownership concept. Can someone explain when to use references vs owned values?",
      tags: ["Rust", "Ownership", "Memory"],
      votes: 12,
      answers: 5,
      views: 234,
      author: "rust_learner",
      time: "6 hours ago",
    },
    {
      title: "Tailwind CSS responsive design patterns",
      excerpt:
        "What are some effective patterns for creating responsive layouts with Tailwind CSS? Looking for examples of mobile-first approaches.",
      tags: ["Tailwind", "CSS", "Responsive"],
      votes: 6,
      answers: 1,
      views: 67,
      author: "css_ninja",
      time: "8 hours ago",
    },
    {
      title: "Database indexing strategies for large datasets",
      excerpt:
        "My application is dealing with millions of records and queries are becoming slow. What indexing strategies should I consider?",
      tags: ["Database", "Performance", "Indexing"],
      votes: 20,
      answers: 7,
      views: 345,
      author: "db_expert",
      time: "1 day ago",
    },
    {
      title: "Vue.js vs React: Performance comparison 2025",
      excerpt:
        "I'm choosing between Vue.js and React for a new project. What are the current performance differences and trade-offs?",
      tags: ["Vue.js", "React", "Performance"],
      votes: 18,
      answers: 4,
      views: 289,
      author: "frontend_dev",
      time: "1 day ago",
    },
    {
      title: "Docker containerization best practices",
      excerpt:
        "What are the current best practices for containerizing Node.js applications with Docker? Looking for optimization tips.",
      tags: ["Docker", "Node.js", "DevOps"],
      votes: 14,
      answers: 3,
      views: 156,
      author: "devops_guy",
      time: "2 days ago",
    },
    {
      title: "GraphQL vs REST API design decisions",
      excerpt:
        "When should I choose GraphQL over REST for my API? What are the pros and cons of each approach?",
      tags: ["GraphQL", "REST", "API Design"],
      votes: 22,
      answers: 6,
      views: 412,
      author: "api_architect",
      time: "2 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UttarHeader />
      <div className="flex">
        <UttarSidebar />
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                All Questions
              </h1>
              <p className="text-gray-600">
                Browse through all the questions asked by our community
              </p>
            </div>
            <div className="space-y-6">
              {sampleQuestions.map((question, index) => (
                <QuestionCard key={index} question={question} />
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors">
                Load More Questions
              </button>
            </div>
          </div>
        </main>
      </div>
      <UttarFooter />
    </div>
  );
}
