import { Vue, Component, Watch } from 'vue-property-decorator'
import { bus, client, Authenticate } from '../shared'
import { router } from '../shared/router';

@Component({ template: 
    `<div>
        <h3>Sign In</h3>
        
        <form ref="form" @submit.prevent="submit" :class="{ error:responseStatus, loading }" >
            <div class="form-group">
                <ErrorSummary except="userName,password" :responseStatus="responseStatus" />
            </div>
            <div class="form-group">
                <Input name="userName" v-model="userName" placeholder="Username" :responseStatus="responseStatus" />
            </div>
            <div class="form-group">
                <Input type="password" name="password" v-model="password" placeholder="Password" :responseStatus="responseStatus" />
            </div>
            <div class="form-group">
                <CheckBox name="rememberMe" v-model="rememberMe" :responseStatus="responseStatus">
                    Remember Me
                </CheckBox>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-lg btn-primary">Login</button>
            </div>
            <div class="form-group">
                <router-link class="btn btn-outline-primary" to="/signup">Register New User</router-link>
            </div>
        </form>
        
        <div class="pt-3">
            <b>Quick Login:</b>
            <p class="pt-1">
                <a class="btn btn-outline-info btn-sm" href="javascript:void(0)" @click.prevent="switchUser('admin@email.com')">admin@email.com</a>
                <a class="btn btn-outline-info btn-sm" href="javascript:void(0)" @click.prevent="switchUser('new@user.com')">new@user.com</a>
            </p>
        </div>
    </div>`
})
export class SignIn extends Vue {
    
    userName = ''
    password = ''
    rememberMe = true
    loading = false
    responseStatus = null

    async submit() {        
        try {
            this.loading = true;
            this.responseStatus = null;

            const response = await client.post(new Authenticate({
                provider: 'credentials',
                userName: this.userName,
                password: this.password,
                rememberMe: this.rememberMe,
            }));
            bus.$emit('signin', response);

            router.push({ path: '/' });
        } catch (e) {
            this.responseStatus = e.responseStatus || e;
        } finally {
            this.loading = false;
        }
    }

    switchUser(email:string) {
        this.userName = email;
        this.password = 'p@55wOrd';
    }
}