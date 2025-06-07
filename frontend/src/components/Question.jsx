import { MessageSquare, ThumbsUp, Eye, Clock, User } from 'lucide-react';
export default function QuestionCard({ question }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 hover:text-cyan-600 cursor-pointer">
          {question.title}
        </h3>
        <div className="flex space-x-2">
          {question.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{question.excerpt}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <ThumbsUp size={16} />
            <span>{question.votes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare size={16} />
            <span>{question.answers}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye size={16} />
            <span>{question.views}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <User size={16} />
          <span>{question.author}</span>
          <Clock size={16} />
          <span>{question.time}</span>
        </div>
      </div>
    </div>
  );
}

