import { Post } from "#types/post";
import { useNavigate } from "react-router-dom";

function ListItem({ item }: { item: Post }) {
  const navigate = useNavigate();
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
      <td className="p-2 text-center">{ item._id }</td>
      <td className="p-2 truncate indent-4 cursor-pointer" onClick={ () => navigate(`${item._id}`) }>{ item.title }</td>
      <td className="p-2 text-center truncate">{ item.user.name }</td>
      <td className="p-2 text-center hidden sm:table-cell">{ item.views }</td>
      <td className="p-2 text-center hidden sm:table-cell">{ item.repliesCount }</td>
      <td className="p-2 truncate text-center hidden sm:table-cell">{ item.updatedAt }</td>
    </tr>
  );
}

export default ListItem;