AngularAbTests is an [angular](https://angular.io/) module that helps you setting up **easily** and **clearly** any AB or multivariate test.

It will **make your tests easy to debug and understand**, regardless of how complex they are, of how many versions you are setting up, or even of how many concurrent tests you are running.

### Update: version 1.2.0 has been released, here is the changelog

1. Added [setter](#manually-read--set-a-specific-version-during-runtime) to change the version of a specific test during runtime


### Contents

- [List of features](#features)
- [Quick introduction to usage](#usage-in-short)
- [Why this plugin is good for you](#why-to-use-this-plugin)
- [How to set up a quick demo to play around](#set-up-a-demo)
- [Full documentation part 1: Initializing](#documentation-1-initializing)
- [Full documentation part 2: Usage](#documentation-2-usage)
- [Full documentation part 3: Tips](#documentation-3-tips)


# Features

- Set up an A/B test with a **simple and descriptive code** (the module makes available just one simple structural directive)
- A/B tests are valid across different pages, using cookies with the expiration you want
- Test **multiple versions** with changes as complicated as you need, while still keeping the code clean and understandable
- Effortlessly set up **any number of independent A/B tests**, being sure that they won't clash in the code
- Select a special version for crawlers, so you won't affect your SEO while you are running the test


# Usage in short

Add it to the list of dependencies using npm: https://www.npmjs.com/package/angular-ab-tests

```
npm install angular-ab-tests --save
```

Set up an A/B test including the module with `forRoot` method:

```javascript
@NgModule({
  imports: [
    AbTestsModule.forRoot([
      {
        versions: [ 'old', 'new' ],
        versionForCrawlers: 'old',
        expiration: 45,
      },
    ]),
  ],
  exports: [
    AbTestsModule,
  ],
})
```

Wrap fragments of HTML inside the structural directive named `abTestVersion`, marking them to belong to one or more of the versions of your A/B test.

```html
<ng-container *abTestVersion="'old'">
  Old version goes here
</ng-container>

<ng-container *abTestVersion="'new'">
  New version goes here
</ng-container>
```


# Why to use this plugin

- You can create several different versions, as complex and as big as you need, without filling your HTML with unnecessary code. This will make your A/B test less error prone, and also it will make it easier to remove the loser versions after the test, because the code is clear and descriptive.
- Versions that are not selected are automatically removed from change detection at initialization, so no performance issues.
- You can easily span your tests across different pages reading the same cookie, with no additional code.
- You can maintain as many different A/B tests you want without risking them to clash in the code.

### What about simple A/B tests? Why should I use AngularAbTests for a simple test as well?

Usually, to set up a small A/B test (changing a color, removing or adding a div, etc) people use client side tools like Google Optimize.

This approach can potentially affect user experience, because Google Optimize has to change parts of the page depending on the specific version selected, and, if this happens while the user is already looking at the page, we have the effect called "page flickering". To prevent page flickering Google Optimize introduced a "hide-page tag", i.e. a script that hides the page until the external call to Google Optimize server has responded.

Now, usually Google Optimize tag loads fast, but you cannot always rely on external calls, especially in conditions of low network; in the worst scenario, if Google Optimize server doesn't respond, the hide-page tag gets unblocked after the threshold of 4 seconds.

This means that, even if your server has responded in 150 milliseconds, your user won't be able to see anything in the page until the 4 seconds have expired.

Are you sure you want to risk this? With AngularAbTests you can set up a simple A/B test easily and cleanly directly in the code, this means that you can get rid of the hide-page tag, and let Google Optimize focus only on data collection.


# Set up a demo

You can setup a simple demo to play around with the plugin and see how it works.

1. Execute `git clone git@github.com:adrdilauro/angular-ab-tests.git`
2. Navigate to repository folder
3. Execute `npm install`
4. Execute `ng serve`
5. Visit `http://0.0.0.0:4200` in your browser

The demo contains a simple A/B test serving two different components depending on the chosen version. You can play around, add more tests / versions, and explore all the configuration options.

**Keep in mind that in the demo `angular-ab-tests` is defined as a local module and not via npm, so if you want the demo code to work for your app you have to replace the imports:**

```javascript
import { AbTestsModule } from './modules/angular-ab-tests/module'; // WRONG! Works only in the demo
import { AbTestsModule } from 'angular-ab-tests'; // CORRECT, works when loading the module from npm
```

AngularAbTests is fully covered by specs: spec file is located in [src/app/directive.spec.ts](https://github.com/adrdilauro/angular-ab-tests/blob/master/src/app/directive.spec.ts), to run it in the demo you have to navigate in the root folder and execute `ng test`


# Documentation 1: Initializing

AngularAbTests declares just one directive called `*abTestVersion`. The directive is structural and it's used to wrap parts of the HTML that you want to A/B test.

In order to use this directive, you need to import the module `AbTestsModule` wherever you need it.

Besides importing the module, the other thing you need to do is initialize the global service the directive reads from: this service is used to store all the running A/B tests, and when it's called by the directive it returns the appropriate test with the version that is currently chosen.

The service needs to be **global**, so it needs to be initialized at root level: for this reason, AngularAbTests provides a `forRoot` method to be used at the root of your application:

```javascript
@NgModule({
  imports: [
    AbTestsModule.forRoot([
      {
        // Configuration for the first test
      },
      {
        // Configuration for the second test
      },
      // etc
    ]),
  ],
})
export class AppModule {}
```

I'll soon explain in detail (see [Documentation 2: Usage](#documentation-2-usage)) both the usage of the directive and the options available in each configuration object. Before coming to that, I want to give some practical tips about the set up process.

## Best practice for setting up AngularAbTests

### 1 - Set up the root import

The best way to set up AngularAbTests is to include the `forRoot` call in your `CoreModule`, this is called the "forRoot pattern" (see [Angular's official documentation](https://angular.io/guide/ngmodule#configure-core-services-with-coremoduleforroot) for details: in a nutshell, when you need a service to be global under all circumstances, you cannot risk it to be included in modules that are lazy loaded, otherwise the lazy loaded module will be provided of a copy of the original service).

So, if you follow the Angular best practice and have your own `CoreModule`, that's the best place to configure AngularAbTests:

```javascript
@NgModule({
  imports: [
    SomeModuleWithProviders,
    AnotherModuleWithProviders,
    AbTestsModule.forRoot([
      {
        // Configuration for the first test
      },
      {
        // Configuration for the second test
      },
      // etc
    ]),
  ],
})
export class CoreModule {
  // Content of the CoreModule, usually a guard against double loading
}
```

If you are setting up a lot of tests, you might want to clean up your `CoreModule` and extract the AngularAbTests logic into a separate one. Create a separate file called `tests.module.ts`:

```javascript
import { NgModule } from '@angular/core';
import { AbTestsModule, AbTestOptions } from 'angular-ab-tests';

export const abTestsOptions: AbTestOptions[] = [
  {
    // Configuration for the first test
  },
  {
    // Configuration for the second test
  },
  // etc
];

@NgModule({
  imports: [
    AbTestsModule.forRoot(abTestsOptions),
  ],
})
export class TestsModule {}
```

In order to clean up better your module, you can declare the configuration options separately as a constant of type `AbTestOptions[]`: type `AbTestOptions` is imported from `angular-ab-tests`. Again, for a detailed description of configuration options, see [the second part of the documentation](#documentation-2-usage).

To complete your refactoring, you then import your `TestsModule` into `CoreModule`:

```javascript
@NgModule({
  imports: [
    SomeModuleWithProviders,
    AnotherModuleWithProviders,
    TestsModule,
  ],
})
export class CoreModule {
  // Content of the CoreModule, usually a guard against double loading
}
```

### 2 - Set up the directive

The best place to set up the directive `*abTestVersion` is the `SharedModule`, in order not to accidentallly forget to import it in every single module. Shared modules are [a recommended way to organize your shared dependencies](https://angular.io/guide/ngmodule#shared-modules).

Simply configure your `SharedModule` to import and re-export the bare `AbTestsModule`, like this:

```
@NgModule({
  imports: [ AbTestsModule ],
  exports: [ AbTestsModule ],
})
export class SharedModule {}
```

To see quickly this whole configuration in action, [please set up the demo](#set-up-a-demo).

To read more about `SharedModule` and `CoreModule`, you might find useful [this list of module patterns from the official docs](https://angular.io/guide/ngmodule-faq#feature-modules).



# Documentation 2: Usage

### The config interface

This is how the configuration `AbTestOptions` is defined:

```javascript
export interface AbTestOptions {
  versions: string[];
  scope?: string;
  versionForCrawlers?: string;
  expiration?: number;
  domain?: string;
  weights?: {
    [x: string]: number,
  };
}
```

When you setup the module using `forRoot`, you have to pass as argument **an array of objects that respect this interface**. Let's go over all the options:

- `versions`: all the versions that your test is going to use (an array of strings): in order not to get confused, better using alphanumeric trimmed strings (anyway, if you accidentally mistype a version later AngularAbTests will raise an exception).
- `scope`: if you are setting up more than one test at the same time, you have to specify a scope to distinguish them; if left undefined it will be automatically the string `'default'`. AngularAbTests will raise an exception if the same scope is used twice.
- `versionForCrawlers`: use this field if you want one of the versions to systematically be shown to crawlers (you don't need to care about this if SEO is not important for you); of course the version needs to be one of the declared ones.
- `expiration`: the number of days you want the cookie to persist; if left undefined the cookie will expire when the browser session ends.
- `domain`: domain for the cookie (if left undefined it will use the standard domain).
- `weights`: a hash of integers `< 100`, associated to the versions you have defined: use this option if you want some of your versions to appear mor frequently than the others. Weights for versions you didn't specify will be equally distributed.

Examples of weight configurations for a list of versions `['v1', 'v2', 'v3']`:

- `{ v1: 40 }` will produce a `40%` chance to extract `v1`, and `30%` for both the other two versions
- `{ v1: 90, v2: 9 }` will produce a `90%` chance to extract `v1`, a `9%` to extract `v2`, and a remaining `1%` to extract `v3`
- `{ v1: 50, v2: 55 }` will raise an exception because `50 + 55 = 105 > 100`
- `{ v1: 40, v2: 30, v3: 35 }` will raise an exception because `40 + 30 + 35 = 105 > 100`
- `{ v1: 40, v6: 45 }` will raise an exception because version `v6` hasn't been declared

Example of a correct complete configuration

```javascript
AbTestsModule.forRoot(
  [
    {
      versions: [ 'v1', 'v2', 'v3' ],
      scope: 'versions',
      expiration: 45,
      weights: { v1: 45, v3: 100/3 }
    },
    {
      versions: [ 'red', 'green', 'blue' ],
      scope: 'colors',
      versionForCrawlers: 'green',
    },
    {
      versions: [ 'old', 'new' ],
      domain: 'xxx.xxx',
      versionForCrawlers: 'old',
      weights: { old: 60 }
    },
  ]
)
```

### The directive

The directive `abTestVersion` wraps a portion of HTML and decides whether showing it or not depending on the following factors:

1. Does the version stored in the cookie match the one declared in the directive?
2. If the call comes from an SEO crawler, has this version been chosen to be shown to crawlers?

This is the most basic implementation of the directive:

```html
<ng-container *abTestVersion="'v1';scope:'default'">
  <!-- Content -->
</ng-container>
```

The "scope" is necessary to map to the correct test if you set up more than one: if you are pointing to the default test, you can omit the scope, like this:

```html
<ng-container *abTestVersion="'v1'">
  <!-- Content -->
</ng-container>
```

You can associate one block of HTML to two versions: instead of writing the directive twice,

```html
<ng-container *abTestVersion="'v1'">
  <!-- Content -->
</ng-container>

<ng-container *abTestVersion="'v2'">
  <!-- Very same content -->
</ng-container>
```

you can simply declare the `abTestVersion` directive once, separating versions with a comma:

```html
<ng-container *abTestVersion="'v1,v2'">
  <!-- Content -->
</ng-container>
```

Versions should be separated by comma without spaces; however don't worry too much about mistyping, because if you accidentally add a space AngularAbTests will realise one of your versions doesn't match any of the declared ones, and raise an exception.

As I have already said, in the configuration you can specify that a version is always going to be shown to SEO crawlers; you can do this at directive level as well, forcing a specific block to be shown to crawlers, regardless of how you had set that test up:

```html
<ng-container *abTestVersion="'v1';forCrawlers:true">
  <!-- Content -->
</ng-container>
```

Even if version `v1` wasn't configured to be shown to SEO crawlers, this specific block will be shown to crawlers.

Remember one thing: if you don't specify any `versionForCrawlers` in your configuration, nor add manually `forCrawlers` in any of your directives, this automatically implies that none of the versions will be rendered when a SEO crawler visits your page; but of course, if your website is an application accessible only via login, that doesn't need to worry about SEO, this would be perfectly fine.

### Manually read / set a specific version during runtime

First, you need to inject the token `AbTestsService`:

```typescript
import { Component } from '@angular/core';
import { AbTestsService } from 'angular-ab-tests';

@Component({
  selector: '...',
  templateUrl: '...',
})
export class MyComponent {
  constructor(private abTestsService: AbTestsService) {
    //...
  }
}
```

You can then call the public methods `getVersion` and `setVersion`, specifying, as usual, the test scope, if you want to work on a specific test that is not the default one.

```typescript
// This retrieves the version associated to default scope
this.abTestsService.getVersion();

// This retrieves the version associated to a scope different by the default one,
// in case you are running multiple tests
this.abTestsService.getVersion('my-scope');

// This sets the version associated to default scope
this.abTestsService.setVersion('xxx'); // It raises an exception if `xxx` is not whitelisted

// This retrieves the version associated to a scope different by the default one,
// in case you are running multiple tests
this.abTestsService.setVersion('xxx', 'my-scope');
```

### Debugging cookies

I strongly suggest you to use the Chrome extension called [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg?hl=en).


# Documentation 3: Tips

### 1 - Apply the directive on a ngContainer

The HTML tag `<ng-container>` is an empty tag that is not rendered, it's used only to wrap a portion of HTML inside a structural directive. I suggest using this tag to associate a portion of HTML to an AB test version:

```html
<!-- Recommended implementation -->
<ng-container *abTestVersion="'old'">
  <component-for-version-old>
  </component-for-version-old>
</ng-container>

<!-- Not recommended because you render an unnecessary div -->
<div *abTestVersion="'old'">
  <component-for-version-old>
  </component-for-version-old>
</div>

<!-- Not recommended because you are mixing the logics of your AB test with the logic of your app -->
<component-for-version-old *abTestVersion="'old'">
</component-for-version-old>
```

### 2 - Pass only static values to the directive

As already mentioned, change detection is disabled for anything contained in a version that is not rendered, so you never risk a performance issue. However, change detection is still enabled on the wrapping directive, so in order to reduce computation to the minimum possible you should pass only static values to the directive:

```html
<!-- Recommended implementation -->
<div *abTestVersion="'old'">
  <!-- Content -->
</div>

<!-- Not recommended because "getOldVersion()" will be fired at every change detection tick -->
<div *abTestVersion="getOldVersion()">
  <!-- Content -->
</div>
```

### 3 - Better to avoid nested directives

You should keep your code logic clean and easy to debug: be careful not to nest calls to directives associated to the same test, otherwise you might get unpredictable behaviours:

```html
<!-- Not recommended -->
<ng-container *abTestVersion="'old'">
  <ng-container *abTestVersion="'new'">

  </ng-container>
</ng-container>
```

In theory, if you nest directives associated to different tests, you are not doing anything wrong; however, there is a high chance that if you are doing that the statistical results of your tests [will clash](#4---ensure-your-tests-are-statistically-consistent).

```html
<!-- In principle this is not wrong, but the results of your tests might not come out consistent -->
<ng-container *abTestVersion="'old';scope:'firsttest'">
  <ng-container *abTestVersion="'new';scope:'secondtest'">

  </ng-container>
</ng-container>
```

**So, better not to nest two directives of type `abTestVersion`.**

How to be sure that you are not nesting two directives? Unfortunately with the decomposition of an HTML page into Angular components there is no definitive way of ensuring this, you'll have to organize your code smartly.


### 4 - Ensure your tests are statistically consistent

Be careful not to produce a false positive by running two AB tests in the same time: there are many blogs covering this topic, for instance one I found is [this](https://conversionxl.com/blog/can-you-run-multiple-ab-tests-at-the-same-time).
