import React from 'react';
import marked from "marked";
import {
  useParams
} from 'react-router-dom'
import Step from "./stepCard";
import './app.css';
import "./recipe.css";

function Recipe(props) {
    const { token } = props;
    const {id} = useParams();
    const [ recipe, setRecipe ] = React.useState( {steps: []} );
    const [ tags, setTags ] = React.useState( [] );
    const [textAreaHeight, setTextAreaHeight] = React.useState( "auto" );
    const [descriptionEditable, setDescriptionEditable] = React.useState( false );
    const [nameEditable, setNameEditable] = React.useState( false );

    const descriptionRef = React.useRef( null );
    const nameRef = React.useRef( null );

    React.useEffect( () => {
        const url = `http://localhost:3001/api/recipes/${ id }`;
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        };

        const handleError = () => {

        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe )
        }

        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
    }, [id] );

    React.useEffect( () => {
        if ( !token) {
            return;
        }
        setTextAreaHeight( descriptionRef.current.scrollHeight )
        descriptionRef.current.focus();
    }, [descriptionEditable, token] )

    React.useEffect( () => {
        if ( !token) {
            return;
        }
        nameRef.current.focus();
    }, [nameEditable, token] )

    const handleDescriptionBlur = (evt) => {
        setDescriptionEditable( false );
        const value = evt.currentTarget.value;
        setRecipe(oldRecipe => {
            const url = `http://localhost:3001/api/recipes/${ id }`;

            const options = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify({...oldRecipe, description: value })
            };

            const handleError = () => {

            }

            const handleSuccess = (res) => {
                console.log("fute-m-as");
                console.log(res);
            }

            fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );

            return {...oldRecipe, description: value }
        });
    }

    const handleDescriptionClick = () => {
        setDescriptionEditable( true );
    }

    function handleTextareaChange(evt) {
        evt.target.style.height = "auto";
        evt.target.style.height = `${ evt.target.scrollHeight }px`;
    }

    const handleNameClick = () => {
        setNameEditable( true );
    }

    const handleNameBlur = (evt) => {
        setNameEditable( false );

        const value = evt.currentTarget.value;
        setRecipe(oldRecipe => {
            const url = `http://localhost:3001/api/recipes/${ id }`;

            const options = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify({...oldRecipe, name: value })
            };

            const handleError = () => {

            }

            const handleSuccess = (res) => {
                console.log(res);
            }

            fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );

            return {...oldRecipe, name: value }
        });
    }

    const handleNameChange = () => {

    }

    const handleNewStepClick = () => {
        const url = `http://localhost:3001/api/recipes/${ id }`;

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify({...recipe, steps: [ ...recipe.steps, { path: "", description: "Placeholder description" } ] })
        };

        const handleError = () => {

        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe );
        }

        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
    }

    const descriptionEditableClass = descriptionEditable ? "active" : "";
    const nameEditableClass = nameEditable ? "name-active" : "";

  return (
      <div className="container-recipe">
          <aside className={ `${ descriptionEditableClass } ${ nameEditableClass }` }>
              <div className="inner-lining">
                {
                    !token && (<h1 className="name-parsed no-hover">{ recipe.name }</h1>)
                }
                {
                    token && (
                        <>
                            <h1 className="name-parsed" onClick={ handleNameClick }>{ recipe.name }</h1>
                            <textarea
                                className="name-marked"
                                onChange={ handleNameChange }
                                onBlur={ handleNameBlur }
                                defaultValue={ recipe.name || "" }
                                ref={nameRef}
                            />
                        </>
                    )
                }

                {
                    !token && (
                        <div
                            className="description-parsed no-hover"
                            dangerouslySetInnerHTML={ {__html: marked( recipe.description || "" )} }
                        />
                    )
                }

                {
                    token && (
                        <>
                            <div
                                className="description-parsed"
                                onClick={ handleDescriptionClick }
                                dangerouslySetInnerHTML={ {__html: marked( recipe.description || "" )} }
                            />
                            <textarea
                                style={ { height: `${ textAreaHeight }px`, overflowY: "hidden" } }
                                onChange={ handleTextareaChange }
                                defaultValue={ recipe.description || "" }
                                ref={descriptionRef}
                                onBlur={ handleDescriptionBlur }
                                className="description-marked"
                            />
                        </>
                    )
                }
                 {
                     tags.length > 0 && (
                         <div className="tags">
                             <button><span>#</span>vegan</button>
                             <button><span>#</span>chickpeas</button>
                             <button><span>#</span>soup</button>
                             <button><span>#</span>greek</button>
                         </div>
                     )
                 }
              </div>
          </aside>
          <main>
              <div className="inner-lining">
                  <div className="content">
                      {
                          recipe.steps.map( (step, index) => (
                              <Step
                                token={ token }
                                key={ index }
                                  step={step}
                                  index={ index }
                                  setRecipe={ setRecipe }
                                  id={id}
                                  recipe={recipe}
                              />
                          ) )
                      }

                      {
                          token && (
                              <div className="card empty" onClick={ handleNewStepClick }>
                                <p>Add step</p>
                              </div>
                          )
                      }
                  </div>
              </div>
          </main>
      </div>
  );
}

export default Recipe;
