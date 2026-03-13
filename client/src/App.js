import './App.css';
import { gql, useQuery } from "@apollo/client"



const query= gql`
  query MyQuery {
    getTodos {
      id
      title
      completed
      user {
        id
        name
      }
    }
  }
`

function App() {
  const {data, loading} = useQuery(query)
  console.log(data)     

  if(loading) return <h1>loading....</h1> 

  return (
    <div className="App">
      {JSON.stringify(data)}

      <table>
        <tbody>
          {
            data.getTodos.map(todo => {
              return (
                <tr key={todo.id}>
                  <td>{todo.title}</td>
                  <td>{todo?.user?.name}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
