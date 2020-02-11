import React from "react";
import { Link } from "react-router-dom";

import "./recipeCard.css";

const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

function RecipeCard (props) {
    const { recipeProps, index, getRecipes, token } = props;

    const [ recipe, setRecipe ] = React.useState( recipeProps )

    const nameRef = React.useRef(null);

    const [ nameEditable, setNameEditable ] = React.useState(false);
    const [textAreaHeight, setTextAreaHeight] = React.useState( "auto" );

    React.useEffect( () => {
        if (!token) {
            return;
        }

        setTextAreaHeight( nameRef.current.scrollHeight )
        nameRef.current.focus();

    }, [nameEditable, token] )

    const recipeEditableClass = nameEditable ? "active" : "";

    const handleRecipeDelete = () => {
        const url = `${baseUrl}/api/recipes/${ recipe._id }`;

        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            },
        };

        const handleError = () => {

        }

        const handleSuccess = (res) => {
            getRecipes()
        }

        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
    };

    const handleRecipeImageDelete = () => {
        const url = `${baseUrl}/api/recipes/${ recipe._id }`;

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify({...recipe, coverPhoto: "" })
        };

        const handleError = () => {

        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe );
        }

        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
    }

    const updateRecipeWithImage = (imagePath) => {
        const url = `${baseUrl}/api/recipes/${ recipe._id }`;

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify({...recipe, coverPhoto: imagePath })
        };

        const handleError = () => {

        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe );
        }

        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
    }

    const handleImageUpload = (evt) => {
        const formData = new FormData();
        const url = `${baseUrl}/api/upload`;

        formData.append( "media", evt.target.files[ 0 ] );

        const handleError = () => {

        }

        const handleSuccess = (res) => {
            updateRecipeWithImage(res.image.path)
        }

        fetch( url, {
            method: "POST",
            headers: {
                "x-access-token": token
            },
            body: formData,
        } ).then( res => res.json() ).then( handleSuccess, handleError );
    }

    const handleTextareaChange = () => {

    }

    const handleNameBlur = () => {

    };

    return (
        <>
        {
            !token && (
                <Link className="card-recipe-link" to={ `/r/${recipe._id}` }>
                    <div className="card card-recipe" key={ recipe._id }>
                        <div className="card-image-wrap">
                          <img src={`${ recipe.coverPhoto }`} alt="" />
                        </div>
                        <p className="name-parsed">
                            { recipe.name }
                        </p>
                    </div>
                </Link>
            )
        }
        {
            token && (
                <div className={`${recipeEditableClass} card card-recipe`} key={ recipe._id }>
                    {
                        recipe.coverPhoto && (
                            <div className="card-image-wrap">
                              <div className="card-actions">
                                  <button className="danger-bg-color danger-color" onClick={ () => handleRecipeDelete(index) }>delete recipe</button>
                                  <button onClick={ handleRecipeImageDelete }>delete image</button>
                                  <Link className="btn" to={ `/r/${recipe._id}` }>go to recipe</Link>
                              </div>
                              <img src={`${ recipe.coverPhoto }`} alt="" />
                            </div>
                        )
                    }

                    {
                        !recipe.coverPhoto && (
                            <div className="card-image-wrap card-empty-image">
                              <div className="card-actions">
                                  <button className="danger-bg-color danger-color" onClick={ () => handleRecipeDelete(index) }>delete recipe</button>
                                  <button className="add-image">
                                      add image
                                      <input type="file" name="media" id="" onChange={ evt => handleImageUpload(evt,index) }/>
                                  </button>
                                  <Link className="btn" to={ `/r/${recipe._id}` }>go to recipe</Link>
                              </div>
                              <div className="card-empty-image"></div>
                            </div>
                        )
                    }
                    <p className="name-parsed" onClick={() => setNameEditable(true)}>
                        { recipe.name || "Recipe name placeholder" }
                    </p>
                    <textarea
                        style={ { height: `${ textAreaHeight }px`, overflowY: "hidden" } }
                        onChange={ handleTextareaChange }
                        defaultValue={ recipe.name || "" }
                        ref={nameRef}
                        onBlur={ handleNameBlur }
                        className="name-marked"
                    />
                </div>
            )
        }
        </>
    )
}

export default RecipeCard;
