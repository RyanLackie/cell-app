<script>
    export default {
        data() {
            return {
                playerOne: {
                    'image': '',
                    'errors': [],
                    'localStorageLocation': 'player-one-image'
                },
                playerTwo: {
                    'image': '',
                    'errors': [],
                    'localStorageLocation': 'player-two-image'
                }
            }
        },

        methods: {
            handlePlayerSelect(option) {
                this.$refs[option].click();
            },

            handleFileSelect(event, playerNumber) {
                const file = event.target.files[0];

                let player = playerNumber === 'one' ?
                    this.playerOne :
                    this.playerTwo;
                player.errors = [];

                // Check if less then 500kb
                const isProperFileSize = file.size / 1000 < 500;
                if (!isProperFileSize) {
                    player.errors.push('Max file size is 500 kb');
                }

                // Check if file is an allowed file extention
                const allowedFileTypes = ['jpeg', 'png', 'jpg', 'gif'];
                const isAllowedFileType = allowedFileTypes.includes(
                    file.name
                        .split('.')
                        .pop()
                        .toLowerCase()
                );
                if (!isAllowedFileType) {
                    player.errors.push('Unsupported file extension');
                }

                // Save file to local storage if cases pass
                if (isProperFileSize && isAllowedFileType) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        localStorage.setItem(player.localStorageLocation, reader.result);
                        player.image = localStorage.getItem(player.localStorageLocation);
                    };
                    reader.onerror = error => {
                        player.errors.push(error);
                    };
                }

                player = player;
            }
        },

        mounted() {
            this.playerOne.image = localStorage.getItem('player-one-image');
            this.playerTwo.image = localStorage.getItem('player-two-image');
        },
    }
</script>


<template>
    <div class="home-container">

        <div class="player-row">
            <h1>
                Select your player image
            </h1>

            <div class="player-select-container">
                <p
                    v-for="error in playerOne.errors"
                    :key="`PlayerOne-${error}`"
                    class="error">
                    {{error}}
                </p>
                <button
                    class="player-select player-one"
                    v-on:click="handlePlayerSelect('player-one-input')">

                    <input
                        type="file"
                        ref="player-one-input"
                        hidden
                        @change="(e) => handleFileSelect(e, 'one')" />

                    <div class="image-container">
                        <img :src="playerOne.image" />
                    </div>
                </button>
            </div>

            <div class="player-select-container">
                <p
                    v-for="error in playerTwo.errors"
                    :key="'PlayerTwo-'+error"
                    class="error">
                    {{error}}
                </p>
                <button
                    class="player-select player-two"
                    v-on:click="handlePlayerSelect('player-two-input')">

                    <input
                        type="file"
                        ref="player-two-input"
                        hidden
                        @change="(e) => handleFileSelect(e, 'two')" />

                    <div class="image-container">
                        <img :src="playerTwo.image" />
                    </div>
                </button>
            </div>
        </div>

        <router-link to="/Game" tag="button" class="router-link">
            Play Game
        </router-link>

    </div>
</template>


<style lang="scss">
    .home-container {
        display: grid;
        grid-template-columns: auto;
        align-content: center;
        justify-content: center;
        width: 100vw;
        height: 100vh;
    }


    .player-row {
        margin-bottom: 20px;
        text-align: center;
    }
    .player-select-container {
        display: inline-block;
        padding: 10px;
    }
    .error {
        color: red;
    }
    .player-select {
		position: relative;
  		width: 300px;
        border-radius: 5px;
        padding: 0;
        display: flex;
		align-items: center;
		justify-content: center;
        cursor: pointer;
        background-size: cover;
        overflow: hidden;
	}
	.player-select:after {
		content: "";
		display: block;
		padding-bottom: 100%;
	}
    .player-one {
        background: green;
        border: 1px green solid;
    }
    .player-two {
        background: red;
        border: 1px red solid;
    }

    .image-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }


    .router-link {
        width: 200px;
        height: 60px;
        margin: 0px auto;
        background: gray;
        color: white;
        border: 2px white solid;
        text-align: center;
        cursor: pointer;
    }
</style>
