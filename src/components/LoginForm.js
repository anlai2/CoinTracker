import React, { Component } from 'react';
import { Text, View } from 'react-native';
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { Button, Card, CardSection, Input, Spinner } from './common';

class LoginForm extends Component {
	state = { email: '', password: '', error: '', loading: false };

	onButtonPress(){
		const {email, password} = this.state;

		this.setState({ error: '', loading: true});

		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(this.onLoginSuccess.bind(this)) //bind references a function to be called in the future
			.catch(() => {
				firebase.auth().createUserWithEmailAndPassword(email, password)
					.then(this.onLoginSuccess.bind(this))
					.catch(this.onLoginFailed.bind(this));
			});
	}

	onLoginFailed() {
		this.setState({error: 'Authentication Failed', loading: false});
	}

	onLoginSuccess() {
		this.setState({ 
			email: '',
			password: '',
			loading: false,
			error: ''
		});
		Actions.main();
	}

	renderButton() {
		if(this.state.loading) {
			return <Spinner size='small'/>;
		}
		return (
			<Button onPress={this.onButtonPress.bind(this)}>
				Login
			</Button>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<Card>
					<CardSection>
						<Input //Username
						placeholder="you@example.com"
						label="Email"
						value={this.state.email} //store user input into value
						onChangeText={email => this.setState({ email })}
						/>
					</CardSection>

					<CardSection>
						<Input //Password
						secureTextEntry
						placeholder="password"
						label= "Password"
						value={this.state.password}
						onChangeText={password => this.setState({ password })}
						/>
					</CardSection>

					<Text style={styles.errorTextStyle}>
						{this.state.error}
					</Text>

					<CardSection>
						{this.renderButton()}
					</CardSection>
				</Card>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#2A033E',
	  },
	errorTextStyle: {
		fontSize: 20,
		alignSelf: 'center',
		color: 'red'
	}
};

export default LoginForm;