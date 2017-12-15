AngularAbTests is an [angular](https://angular.io/) module that helps you setting up **easily** and **clearly** any AB or multivariate test.

It will **make your tests easy to debug and understand**, regardless of how complex they are, of how many versions you are setting up, or even of how many concurrent tests you are running.

### Contents

- [List of features](https://github.com/adrdilauro/angular-ab-tests#features)
- [Quick introduction to usage](https://github.com/adrdilauro/angular-ab-tests#usage-in-short)
- [Why this plugin is good for you](https://github.com/adrdilauro/angular-ab-tests#why-to-use-this-plugin)
- [How to set up a quick demo to play around](https://github.com/adrdilauro/angular-ab-tests#setup-a-demo)
- [Full documentation part 1: Initializing](https://github.com/adrdilauro/angular-ab-tests#documentation-1-initializing)
- [Full documentation part 2: Usage](https://github.com/adrdilauro/angular-ab-tests#documentation-2-usage)
- [Full documentation part 3: Tips](https://github.com/adrdilauro/angular-ab-tests#documentation-3-tips)


# Features

- Set up an A/B test with a **simple and descriptive code** (the module makes available just one simple structural directive)
- A/B tests are valid across different pages, using cookies with the expiration you want
- Test multiple versions with changes as complicated as you need, while still keeping the code clean and understandable
- Effortlessly set up any number of separate A/B tests, being sure that they won't clash in the code
- Select a special version for crawlers, so you won't affect your SEO while you are running the test


# Usage in short

Add it to the list of dependencies using npm: [link to npm repo]

```
npm install xxx # TODO
```

Setup an A/B test including the module with `forRoot` method:

```typescript
@NgModule({
  imports: [
    AbTestsModule.forRoot([
      {
        {
          versions: [ 'old', 'new' ],
          versionForCrawlers: 'old',
          expiration: 45,
        },
      }
    ]),
  ],
  exports: [
    AbTestsModule,
  ],
})
```

Wrap fragments of HTML inside the structural directive `abTestVersions`, marking them to belong to one or more of the versions of your A/B test.

```html
<ng-container *abTestVersion="'old'">
  Old version goes here
</ng-container>

<ng-container *abTestVersion="'new'">
  New version goes here
</ng-container>
```


# Why to use this plugin




Metti anche che change detection is removed completely!
Nice syntax


# Setup a demo

suggerisci how to play around


# Documentation 1: Initializing

metti prima forRoot e directive structural (con link a angular guide)
usage metti link below anchor
poi spiega il mio modo ideale con link a demo e anche codice lì


# Documentation 2: Usage

tutti I casi
metti link a chrome cookie tool


# Documentation 3: Tips
