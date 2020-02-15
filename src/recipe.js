import React from 'react';
import marked from "marked";
import {
  useParams
} from 'react-router-dom'
import apiService from "./apiService";
import Step from "./stepCard";
import './app.css';
import "./recipe.css";

function Recipe(props) {
    const { token } = props;
    const {id} = useParams();
    const [ recipe, setRecipe ] = React.useState( {steps: []} );
    const [ tags, setTags ] = React.useState( [] );
    const [ authorisation, setAuthorisation ] = React.useState( null );
    const [ toggle, setToggle ] = React.useState( false );
    const [textAreaHeight, setTextAreaHeight] = React.useState( "auto" );
    const [descriptionEditable, setDescriptionEditable] = React.useState( false );
    const [nameEditable, setNameEditable] = React.useState( false );

    const descriptionRef = React.useRef( null );
    const nameRef = React.useRef( null );

    React.useEffect( () => {
        const handleError = (err) => {
            console.log(err);
        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe );
            setAuthorisation( res.authorised );
        }

        apiService({
            path: `/api/recipes/${ id }`
        }).then( handleSuccess, handleError );
    }, [id, token] );

    React.useEffect( () => {
        if ( !token || !authorisation) {
            return;
        }
        setTextAreaHeight( descriptionRef.current.scrollHeight )
        descriptionRef.current.focus();
    }, [authorisation, descriptionEditable, token] )

    React.useEffect( () => {
        if ( !token || !authorisation) {
            return;
        }
        nameRef.current.focus();
    }, [authorisation, nameEditable, token] )

    const handleDescriptionBlur = (evt) => {
        setDescriptionEditable( false );
        const value = evt.currentTarget.value;

        setRecipe(oldRecipe => {
            const newRecipe = {...oldRecipe, description: value };
            apiService( {
                path: `/api/recipes/${ id }`,
                method: "PUT",
                body: newRecipe
            } );

            return newRecipe;
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
            const newRecipe = {...oldRecipe, name: value};
            const handleError = (err) => {
                console.log(err);
            }

            const handleSuccess = (res) => {
                console.log(res);
            }

            apiService({
                path: `/api/recipes/${ id }`,
                method: "PUT",
                body: newRecipe
            }).then( handleSuccess, handleError );

            return newRecipe;
        });
    }

    const handleNameChange = () => {

    }

    const handleNewStepClick = () => {
        const handleError = (err) => {
            console.log(err);
        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe );
        }

        apiService( {
            path: `/api/recipes/${ id }`,
            method: "PUT",
            body: {...recipe, steps: [ ...recipe.steps, { path: "", description: "Placeholder description" } ] }
        } ).then( handleSuccess, handleError );
    }

    const descriptionEditableClass = descriptionEditable ? "active" : "";
    const nameEditableClass = nameEditable ? "name-active" : "";

  return (
      <div className="container-recipe">
          <aside className={ `${ descriptionEditableClass } ${ nameEditableClass } ${ toggle ? "toggle-active" : "toggle-inactive" }` }>
              <div className="inner-lining">
                <button className="show-ingredients toggle-ingredients" onClick={ () => setToggle( true ) }>
                    Show Ingredients
                </button>
                <button className="hide-ingredients toggle-ingredients" onClick={ () => setToggle( false ) }>
                    &times;
                </button>
                {
                    !token || !authorisation && (<h1 className="name-parsed no-hover">{ recipe.name }</h1>)
                }
                {
                    token && authorisation && (
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
                    (!token || !authorisation) && (
                        <div
                            className="description-parsed no-hover"
                            dangerouslySetInnerHTML={ {__html: marked( recipe.description || "" )} }
                        />
                    )
                }

                {
                    token && authorisation && (
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
                                authorisation={authorisation}
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
                          token && authorisation && (
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
