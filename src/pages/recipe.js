import React from 'react';
import marked from "marked";
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import apiService from "../helpers/apiService";
import Step from "../components/stepCard";

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
      <ContainerRecipeStyled>
          <aside className={ `${ descriptionEditableClass } ${ nameEditableClass } ${ toggle ? "toggle-active" : "toggle-inactive" }` }>
              <InnerLiningStyled>
                <button className="show-ingredients toggle-ingredients" onClick={ () => setToggle( true ) }>
                    Show Ingredients
                </button>
                <button className="hide-ingredients toggle-ingredients" onClick={ () => setToggle( false ) }>
                    &times;
                </button>
                {
                    (!token || !authorisation) && (<h1 className="name-parsed no-hover">{ recipe.name }</h1>)
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
              </InnerLiningStyled>
          </aside>
          <main>
              <InnerLiningStyled>
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
              </InnerLiningStyled>
          </main>
      </ContainerRecipeStyled>
  );
}

const ContainerRecipeStyled = styled.div`
    height: 100%;
    display: flex;

    aside,
    main {
        height: 100%;
    }

    main {
        flex-grow: 1;
        position: relative;
    }

    aside {
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: 4;
        left: -100%;
        background: #D0D0D0;
    }

    aside.toggle-active {
        left: 0;
    }

    aside.toggle-inactive .inner-lining {
        overflow: visible;
    }

    aside .show-ingredients {
        position: absolute;
        top: 20px;
        right: -122px;
        padding: 7px 5px;
        background: lightblue;
        border: 1px solid #ccc;
        border-radius: 3px;
        font-size: 14px;
        cursor: pointer;
    }

    aside .hide-ingredients {
        position: absolute;
        top: 20px;
        right: 20px;
    }

    @media only screen and (min-width: 800px) {
        aside .show-ingredients,
        aside .hide-ingredients {
            display: none;
        }
        aside {
            height: 100%;
            min-width: 400px;
            width: auto;
            position: relative;
            left: 0;
        }
    }


    aside .description-parsed ul {
        font-size: 13px;
        line-height: 16px;
        padding: 0;
        list-style-type: none;
        margin: 0;
    }

    aside .description-parsed li {
        margin-bottom: 5px;
        position: relative;
        padding-left: 12px;
    }

    aside .description-parsed li:before {
        content: "";
        position: absolute;
        left: 0;
        top: 6px;
        width: 5px;
        height: 5px;
        background: #000;
        border-radius: 50%;
    }

    aside .description-parsed li p {
        margin: 0;
    }

    aside .tags {
        padding: 0 10px;
    }

    aside .tags button {
        color: #000;
        text-decoration: none;
        font-size: 14px;
        background: none;
        border: 0;
        cursor: pointer;
        padding: 0;
        margin: 0 10px 0 0;
    }

    aside .tags button span {
        color: #C18024
    }

    aside.active .description-parsed,
    aside.name-active .name-parsed {
        display: none;
    }

    aside.active .description-marked,
    aside.name-active .name-marked {
        display: block;
    }

    .description-parsed,
    .name-parsed {
        cursor: pointer;
        transition: background .2s;
        padding: 10px 10px 1px;
        border-radius: 4px;
        margin: 0 0 10px;
        display: block;
    }

    .description-parsed.no-hover:hover,
    .name-parsed.no-hover:hover {
        cursor: auto;
        background: none;
    }

    .name-parsed {
        padding-bottom: 10px;
    }

    .description-parsed h2 {
        margin: 0 0 10px;
    }

    .description-parsed:hover,
    .name-parsed:hover {
        background: #E3E2E6;
    }

    .description-marked,
    .name-marked {
        border: none;
        background: #E3E2E6;
        transition: background .2s;
        padding: 10px;
        border-radius: 4px;
        margin: 0 0 10px;
        font-family: 'Inconsolata', monospace;
        resize: none;
        font-size: 18px;
        width: 100%;
        display: none;
    }

    .name-marked {
        font-family: 'Open Sans', sans-serif;
        font-size: 24px;
        font-weight: 700;
    }

    .description-marked:focus {
        outline: none;
    }

    .card.empty {
        background: #EAEAED;
        cursor: pointer;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300px;
    }
`;

const InnerLiningStyled = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 20px;

    .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: stretch;
    }
`;

export default Recipe;
